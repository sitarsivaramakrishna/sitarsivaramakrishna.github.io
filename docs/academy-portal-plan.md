# SRK Academy Portal — Implementation Plan

## Overview

A scheduling portal embedded in `guru.html` with two roles:
- **Guruji (teacher)** — manages students, schedules classes, sees full calendar, sends WhatsApp reminders via wa.me/ links
- **Students** — read-only view of their own classes only

**Stack**: Existing static site on GitHub Pages + Firebase Auth + Firestore (added via `<script>` tags). No server, no build tools, no hosting changes.

**Cost**: Free. Firebase free tier covers 50K auth users, 1GB storage, 50K reads/day — we'll use <1% of these limits.

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Backend | Firebase (Auth + Firestore) | Free, Google product, works with static sites via script tags, no server to maintain |
| WhatsApp | wa.me/ links (manual send) | Zero infrastructure, zero risk of account bans. Guruji taps link, WhatsApp opens with pre-filled message, hits send |
| Calendar UI | Custom HTML/CSS/JS grid | Lightweight, matches site aesthetic, no library needed for simple 1hr one-on-one slots |
| Scheduling model | Both recurring + one-off | Junior students: fixed weekly slots. Senior students: scheduled individually each week |
| Account creation | Guruji creates student accounts | No self-registration. Guruji controls who has access |
| Student info | Name, email, WhatsApp, class type, day/time (if recurring), level, start date, instrument owned, notes | Lean but sufficient |
| Class info | Student, date, time, duration (default 1hr), mode (online/in-person), notes | Can add fields later |
| Portal location | On guru.html with login button in header banner | Bookmarkable URL: `sitarsiva.in/guru.html#portal` |
| Auth strength | Strong for guruji (Firebase Auth, email+password, rate limiting). Same mechanism for students but read-only access | Guruji's account is pre-created with teacher role set in Firestore via Firebase Console |
| Framework | None — plain HTML/CSS/JS | Consistent with rest of site, no build tools, portal is not complex enough to warrant a framework |

---

## Data Model (Firestore)

### Collection: `students`
```
students/{id}
  name: string
  email: string
  whatsapp: string (with country code, e.g., "919876543210")
  level: string (beginner | intermediate | advanced)
  startDate: timestamp
  instrumentOwned: boolean
  classType: string (recurring | flexible)
  notes: string
  authUid: string (links to Firebase Auth user)
  createdAt: timestamp
```

### Collection: `recurringSlots`
```
recurringSlots/{id}
  studentId: string (reference to students doc)
  studentName: string (denormalized for display)
  dayOfWeek: number (0=Sunday, 1=Monday, ..., 6=Saturday)
  time: string ("10:00", "14:30", etc.)
  duration: number (minutes, default 60)
  mode: string (online | in-person)
  active: boolean
  createdAt: timestamp
```

### Collection: `classes`
```
classes/{id}
  studentId: string
  studentName: string (denormalized for display)
  studentWhatsapp: string (denormalized for wa.me/ link)
  date: timestamp
  time: string
  duration: number (minutes)
  mode: string (online | in-person)
  status: string (scheduled | completed | cancelled)
  notes: string
  fromRecurringSlot: string | null (slot ID if auto-generated)
  whatsappSent: boolean (track if reminder was sent)
  createdAt: timestamp
```

### How recurring classes work:
- Guruji creates a `recurringSlot` (e.g., "Ravi, every Tuesday 10am, online")
- Client-side logic auto-generates `classes` documents 4 weeks ahead
- Each generated class has `fromRecurringSlot` pointing back to the slot
- Guruji can cancel/reschedule individual classes without breaking the pattern
- When a recurring slot is deactivated, no new classes are generated

---

## Security Rules (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Teacher config — stores guruji's uid marked as teacher
    match /config/teacher {
      allow read: if request.auth != null;
    }

    // Students — teacher full access, students read own profile only
    match /students/{studentId} {
      allow read, write: if isTeacher();
      allow read: if request.auth != null
                  && resource.data.authUid == request.auth.uid;
    }

    // Recurring slots — teacher only
    match /recurringSlots/{slotId} {
      allow read, write: if isTeacher();
    }

    // Classes — teacher full access, students read own classes only
    match /classes/{classId} {
      allow read, write: if isTeacher();
      allow read: if request.auth != null
                  && resource.data.studentId == getStudentId();
    }

    function isTeacher() {
      return request.auth != null
        && get(/databases/$(database)/documents/config/teacher).data.uid == request.auth.uid;
    }

    function getStudentId() {
      // Query students collection to find doc where authUid matches
      return request.auth.uid;
    }
  }
}
```

Note: Exact rules will be refined during implementation. The principle is:
- Teacher role is stored in a `config/teacher` doc (set once via Firebase Console)
- No one can self-assign teacher role
- Students can only read documents where their own ID matches

---

## UI Design

### Login Button
- Positioned in guru.html page header banner (top-right area)
- Styled to match site aesthetic (gold/cream, Playfair Display font)
- Opens a login modal

### Guruji's View (after login)

```
┌──────────────────────────────────────────────────┐
│  SRK Academy Portal              [wa.me setup] [Logout]  │
├──────────────────────────────────────────────────┤
│  Tabs: [Calendar]  [Students]  [Recurring Slots] │
├──────────────────────────────────────────────────┤
│                                                  │
│  CALENDAR TAB:                                   │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ ◄ May 2026 ► │  │ Tuesday, May 6           │  │
│  │              │  │                          │  │
│  │ M  T  W  T  F│  │ 10:00 Ravi (online)  📱  │  │
│  │    1  2  3  4│  │ 11:00 Priya (in-person)📱│  │
│  │ 5• 6• 7  8  9│  │ 14:00 Amit (online)  📱  │  │
│  │ 12 13 14 15 16│ │ 16:00 Deepa (in-person)📱│ │
│  │ ...          │  │                          │  │
│  │              │  │ [+ Schedule Class]       │  │
│  └──────────────┘  └──────────────────────────┘  │
│                                                  │
│  • = days with classes                           │
│  📱 = click to open wa.me/ reminder link         │
│                                                  │
│  STUDENTS TAB:                                   │
│  ┌──────────────────────────────────────────────┐│
│  │ [+ Add Student]                              ││
│  │                                              ││
│  │ Name      Level    Type       WhatsApp       ││
│  │ Ravi      Beginner Recurring  +91 98765...   ││
│  │ Priya     Inter.   Flexible   +91 87654...   ││
│  │ Amit      Advanced Flexible   +91 76543...   ││
│  │ [Edit] [Delete]                              ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  RECURRING SLOTS TAB:                            │
│  ┌──────────────────────────────────────────────┐│
│  │ [+ Add Recurring Slot]                       ││
│  │                                              ││
│  │ Student   Day       Time   Mode     Status   ││
│  │ Ravi      Tuesday   10:00  Online   Active   ││
│  │ Deepa     Thursday  16:00  In-person Active  ││
│  │ [Edit] [Deactivate]                          ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### Student's View (after login)

```
┌──────────────────────────────────────────────────┐
│  Welcome, Ravi                         [Logout]  │
├──────────────────────────────────────────────────┤
│                                                  │
│  Upcoming Classes                                │
│  ───────────────                                 │
│  📅 Tue, May 6   10:00 AM   Online               │
│  📅 Tue, May 13  10:00 AM   Online               │
│  📅 Tue, May 20  10:00 AM   Online               │
│  📅 Tue, May 27  10:00 AM   Online               │
│                                                  │
│  Past Classes                                    │
│  ───────────────                                 │
│  ✓ Tue, Apr 29  10:00 AM   Online                │
│  ✓ Tue, Apr 22  10:00 AM   Online                │
│  ✓ Tue, Apr 15  10:00 AM   Online                │
│                                                  │
└──────────────────────────────────────────────────┘
```

Simple chronological list. No calendar grid needed for students.

---

## WhatsApp Integration (wa.me/ links)

When guruji clicks the 📱 icon next to a class:

```
https://wa.me/919876543210?text=Namaste%21%20Your%20sitar%20class%20is%20scheduled%20for%20Tuesday%2C%20May%206%20at%2010%3A00%20AM%20%28Online%29.%20%E2%80%94%20SRK%20Academy%20of%20Music
```

This opens WhatsApp (on phone or WhatsApp Web) with the message pre-filled:

> Namaste! Your sitar class is scheduled for Tuesday, May 6 at 10:00 AM (Online). — SRK Academy of Music

Guruji hits send. Done. No API, no setup, no risk.

The `whatsappSent` field on the class tracks whether the reminder was sent (toggled after guruji clicks the link).

---

## Implementation Phases

### Phase 1 — Firebase Setup + Auth (~1 session)
- [ ] Create Firebase project (user does this in Firebase Console)
- [ ] Add Firebase SDK to guru.html (script tags)
- [ ] Create `js/portal.js` with Firebase initialization
- [ ] Login button in guru.html page header
- [ ] Login modal (email + password)
- [ ] Auth state listener (show portal when logged in, hide when not)
- [ ] Create guruji's account and set teacher role in Firestore
- [ ] Basic portal container with tabs (empty for now)

### Phase 2 — Student Management (~1 session)
- [ ] Students tab UI (list view + add/edit form)
- [ ] Add student: create Firestore doc + Firebase Auth account
- [ ] Edit student details
- [ ] Delete/deactivate student
- [ ] Form validation (required fields, WhatsApp format)

### Phase 3 — Calendar + Scheduling (~2 sessions)
- [ ] Month calendar component (custom HTML/CSS/JS)
- [ ] Day detail view (list of classes for selected day)
- [ ] Schedule one-off class form (pick student, date, time, mode, notes)
- [ ] Recurring slot management (add/edit/deactivate)
- [ ] Auto-generate classes from recurring slots (4 weeks ahead)
- [ ] Cancel individual class (without breaking recurring pattern)
- [ ] Reschedule individual class
- [ ] Mark class as completed
- [ ] Class notes (add/edit)

### Phase 4 — Student View (~1 session)
- [ ] Student login flow
- [ ] Upcoming classes list (read-only)
- [ ] Past classes list
- [ ] Bookmarkable URL: `guru.html#portal`
- [ ] Responsive design for mobile

### Phase 5 — WhatsApp + Polish (~1 session)
- [ ] wa.me/ link generation with pre-filled message
- [ ] WhatsApp sent tracking (mark as sent)
- [ ] Mobile responsive for all portal views
- [ ] Styling to match sitarsiva.in aesthetic (maroon, gold, cream, Playfair Display)
- [ ] Empty states (no classes today, no students yet, etc.)
- [ ] Minify portal.js
- [ ] Update css/style.min.css with new portal styles

---

## Files

| File | Action | Description |
|---|---|---|
| `guru.html` | Modify | Add Firebase SDK script tags, login button in header, portal section |
| `js/portal.js` | Create | Firebase init, auth, calendar rendering, scheduling, student management |
| `css/style.css` | Modify | Add portal styles (calendar, forms, tabs, modal, responsive) |
| `css/style.min.css` | Regenerate | Re-minify after CSS changes |
| `js/portal.min.js` | Create | Minified version of portal.js (Phase 5) |

No changes to index.html, sitarist.html, or composer.html.

---

## Future Growth

The portal is designed to grow. Possible additions:
- **Attendance tracking** — guruji marks classes as completed, view attendance stats
- **Practice log** — students log daily practice hours
- **Raga progress tracker** — which ragas each student has learned
- **Payment tracking** — fees, receipts
- **Automated WhatsApp** — upgrade from wa.me/ links to WhatsApp Cloud API
- **Student notes/feedback** — guruji's notes per student per class
- **Recital scheduling** — special events, group performances

Each of these would be a new tab or section in the portal, using the same Firebase infrastructure.
