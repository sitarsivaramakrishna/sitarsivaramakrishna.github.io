import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import {
  getFirestore, doc, getDoc, collection, query, where, getDocs,
  addDoc, updateDoc, deleteDoc, onSnapshot, orderBy, Timestamp
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDDI6z3q7J37toDzZuL5kCR4IBAlKEy9XY",
  authDomain: "srk-academy-b2361.firebaseapp.com",
  projectId: "srk-academy-b2361",
  storageBucket: "srk-academy-b2361.firebasestorage.app",
  messagingSenderId: "499250019776",
  appId: "1:499250019776:web:3b1507957723c5c8a99c25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const secondaryApp = initializeApp(firebaseConfig, 'accountCreator');
const secondaryAuth = getAuth(secondaryApp);

let currentUser = null;
let userRole = null;
let studentProfile = null;
let studentsCache = [];
let classesCache = [];
let recurringCache = [];
let editingStudentId = null;
let editingClassId = null;
let selectedDate = null;
let viewMonth = new Date();
let studentSearchTerm = '';
let studentsUnsubscribe = null;
let classesUnsubscribe = null;
let recurringUnsubscribe = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  initAuth();
  initLoginModal();
  initTabs();
  initStudentModal();
  initClassModal();
  initRecurringModal();
  initCalendar();
  handleHash();
}

// === AUTH ===

function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      await determineRole();
      updateUI();
      if (userRole === 'teacher') {
        startStudentsListener();
        startClassesListener();
        startRecurringListener();
      } else if (userRole === 'student') {
        startStudentClassesListener();
      }
    } else {
      currentUser = null;
      userRole = null;
      studentProfile = null;
      [studentsUnsubscribe, classesUnsubscribe, recurringUnsubscribe].forEach(fn => { if (fn) fn(); });
      studentsUnsubscribe = classesUnsubscribe = recurringUnsubscribe = null;
      updateUI();
    }
  });

  const logoutBtn = $('#portal-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));
}

async function determineRole() {
  try {
    const teacherDoc = await getDoc(doc(db, 'config', 'teacher'));
    if (teacherDoc.exists() && teacherDoc.data().uid === currentUser.uid) {
      userRole = 'teacher'; return;
    }
  } catch (e) { console.error('Role check failed:', e); }

  try {
    const q = query(collection(db, 'students'), where('authUid', '==', currentUser.uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      userRole = 'student';
      studentProfile = { id: snap.docs[0].id, ...snap.docs[0].data() };
      return;
    }
  } catch (e) { console.error('Student check failed:', e); }

  userRole = null;
}

// === LOGIN MODAL ===

function initLoginModal() {
  const loginBtn = $('#portal-login-btn');
  const modal = $('#login-modal');
  const closeBtn = $('#login-modal-close');
  const form = $('#login-form');

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser && userRole) {
        $('#portal')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        modal.style.display = 'flex';
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; clearLoginError(); });
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; clearLoginError(); } });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.portal-modal-overlay').forEach(m => {
      if (m.style.display === 'flex') { m.style.display = 'none'; }
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('[type="email"]').value.trim();
      const password = form.querySelector('[type="password"]').value;
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in…';
      clearLoginError();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        modal.style.display = 'none';
        form.reset();
      } catch (err) {
        showLoginError(authErrorMessage(err.code));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
}

function showLoginError(msg) { const el = $('#login-error'); if (el) { el.textContent = msg; el.style.display = 'block'; } }
function clearLoginError() { const el = $('#login-error'); if (el) { el.textContent = ''; el.style.display = 'none'; } }
function authErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-credential': case 'auth/wrong-password': case 'auth/user-not-found': return 'Invalid email or password.';
    case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Login failed. Please try again.';
  }
}

// === UI ===

function updateUI() {
  const loginBtn = $('#portal-login-btn');
  const portal = $('#portal');
  const teacherView = $('#teacher-view');
  const studentView = $('#student-view');
  const noRoleView = $('#no-role-view');
  const userName = $('#portal-user-name');
  const logoutBtn = $('#portal-logout');
  const portalNavLink = $('#portal-nav-link');

  if (currentUser) {
    if (loginBtn) loginBtn.textContent = 'Go to Portal';
    if (userRole === 'teacher') {
      show(portal); show(teacherView); hide(studentView); hide(noRoleView);
      if (userName) userName.textContent = 'Guruji';
    } else if (userRole === 'student') {
      show(portal); hide(teacherView); show(studentView); hide(noRoleView);
      if (userName) userName.textContent = studentProfile?.name || 'Student';
    } else {
      show(portal); hide(teacherView); hide(studentView); show(noRoleView);
      if (userName) userName.textContent = currentUser.email;
    }
    show(logoutBtn); show(portalNavLink);
    if (window.location.hash === '#portal' && portal) {
      setTimeout(() => portal.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  } else {
    if (loginBtn) loginBtn.textContent = 'Student Portal';
    hide(portal); hide(logoutBtn); hide(portalNavLink);
  }
}

function show(el) { if (el) el.style.display = ''; }
function hide(el) { if (el) el.style.display = 'none'; }

// === TABS ===

function initTabs() {
  $$('.portal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.portal-tab').forEach(t => t.classList.remove('active'));
      $$('.tab-pane').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const pane = $('#tab-' + tab.dataset.tab);
      if (pane) pane.style.display = '';
    });
  });
}

// === STUDENTS ===

function startStudentsListener() {
  if (studentsUnsubscribe) return;
  const q = query(collection(db, 'students'), orderBy('name'));
  studentsUnsubscribe = onSnapshot(q, (snap) => {
    studentsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderStudentList();
  });
}

function renderStudentList() {
  const container = $('#students-list');
  if (!container) return;

  if (studentsCache.length === 0) {
    container.innerHTML = '<div class="portal-placeholder"><h3>No Students Yet</h3><p>Click "+ Add Student" to register your first student.</p></div>';
    return;
  }

  const term = studentSearchTerm.toLowerCase();
  const filtered = term
    ? studentsCache.filter(s => s.name.toLowerCase().includes(term) || (s.email || '').toLowerCase().includes(term))
    : studentsCache;

  let html = '<input type="text" class="portal-search" id="student-search" placeholder="Search students by name…" value="' + esc(studentSearchTerm) + '">';

  if (filtered.length === 0) {
    html += '<p class="cal-empty-day">No students matching "' + esc(studentSearchTerm) + '"</p>';
  } else {
    html += '<div class="portal-table-wrap"><table class="portal-table">' +
      '<thead><tr><th>Name</th><th>Level</th><th>Type</th><th>WhatsApp</th><th>Actions</th></tr></thead><tbody>';
    for (const s of filtered) {
      html += '<tr><td><strong>' + esc(s.name) + '</strong><br><span class="portal-table-sub">' + esc(s.email || '') + '</span></td>' +
        '<td>' + capitalize(s.level) + '</td><td>' + (s.classType === 'recurring' ? 'Recurring' : 'Flexible') + '</td>' +
        '<td>' + esc(s.whatsapp || '—') + '</td>' +
        '<td class="portal-table-actions">' +
        '<button class="portal-btn-sm portal-btn-edit" data-action="edit-student" data-id="' + s.id + '">Edit</button>' +
        '<button class="portal-btn-sm portal-btn-delete" data-action="delete-student" data-id="' + s.id + '">Delete</button>' +
        '</td></tr>';
    }
    html += '</tbody></table></div>';
  }

  html += '<p class="portal-table-count">' + studentsCache.length + ' student' + (studentsCache.length !== 1 ? 's' : '') + ' total</p>';
  container.innerHTML = html;

  const searchInput = $('#student-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      studentSearchTerm = e.target.value;
      renderStudentList();
      const el = $('#student-search');
      if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
    });
  }

  container.querySelectorAll('[data-action="edit-student"]').forEach(b => b.addEventListener('click', () => openEditStudentModal(b.dataset.id)));
  container.querySelectorAll('[data-action="delete-student"]').forEach(b => b.addEventListener('click', () => handleDeleteStudent(b.dataset.id)));
}

function initStudentModal() {
  const addBtn = $('#add-student-btn');
  const closeBtn = $('#student-modal-close');
  const modal = $('#student-modal');
  const form = $('#student-form');
  if (addBtn) addBtn.addEventListener('click', openAddStudentModal);
  if (closeBtn) closeBtn.addEventListener('click', closeStudentModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeStudentModal(); });
  if (form) form.addEventListener('submit', handleStudentFormSubmit);
}

function openAddStudentModal() {
  editingStudentId = null;
  const form = $('#student-form');
  $('#student-modal-title').textContent = 'Add Student';
  form.reset();
  form.querySelector('[name="email"]').closest('.portal-form-group').style.display = '';
  form.querySelector('[name="password"]').closest('.portal-form-group').style.display = '';
  form.querySelector('[type="submit"]').textContent = 'Add Student';
  clearStudentError();
  $('#student-modal').style.display = 'flex';
}

function openEditStudentModal(id) {
  const s = studentsCache.find(x => x.id === id);
  if (!s) return;
  editingStudentId = id;
  const form = $('#student-form');
  $('#student-modal-title').textContent = 'Edit Student';
  form.querySelector('[name="email"]').closest('.portal-form-group').style.display = 'none';
  form.querySelector('[name="password"]').closest('.portal-form-group').style.display = 'none';
  form.querySelector('[type="submit"]').textContent = 'Save Changes';
  form.querySelector('[name="name"]').value = s.name || '';
  form.querySelector('[name="whatsapp"]').value = s.whatsapp || '';
  form.querySelector('[name="classType"]').value = s.classType || '';
  form.querySelector('[name="level"]').value = s.level || '';
  form.querySelector('[name="startDate"]').value = s.startDate || '';
  form.querySelector('[name="instrumentOwned"]').checked = s.instrumentOwned || false;
  form.querySelector('[name="notes"]').value = s.notes || '';
  clearStudentError();
  $('#student-modal').style.display = 'flex';
}

function closeStudentModal() { hide($('#student-modal')); editingStudentId = null; }

async function handleStudentFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  clearStudentError();

  const data = {
    name: form.querySelector('[name="name"]').value.trim(),
    whatsapp: form.querySelector('[name="whatsapp"]').value.trim(),
    classType: form.querySelector('[name="classType"]').value,
    level: form.querySelector('[name="level"]').value,
    startDate: form.querySelector('[name="startDate"]').value || null,
    instrumentOwned: form.querySelector('[name="instrumentOwned"]').checked,
    notes: form.querySelector('[name="notes"]').value.trim()
  };

  if (!data.name || !data.whatsapp || !data.classType || !data.level) {
    showStudentError('Please fill in all required fields.'); return;
  }

  btn.disabled = true;

  if (editingStudentId) {
    btn.textContent = 'Saving…';
    try {
      await updateDoc(doc(db, 'students', editingStudentId), data);
      closeStudentModal();
    } catch (err) { showStudentError('Failed: ' + err.message); }
    finally { btn.disabled = false; btn.textContent = 'Save Changes'; }
  } else {
    const email = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;
    if (!email) { showStudentError('Email is required.'); btn.disabled = false; return; }
    if (password.length < 6) { showStudentError('Password must be at least 6 characters.'); btn.disabled = false; return; }

    btn.textContent = 'Creating account…';
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await signOut(secondaryAuth);
      data.email = email;
      data.authUid = cred.user.uid;
      data.createdAt = Timestamp.now();
      await addDoc(collection(db, 'students'), data);
      closeStudentModal();
    } catch (err) {
      showStudentError(err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : 'Failed: ' + err.message);
    } finally { btn.disabled = false; btn.textContent = 'Add Student'; }
  }
}

async function handleDeleteStudent(id) {
  const s = studentsCache.find(x => x.id === id);
  if (!s || !confirm('Remove ' + s.name + '? They will no longer be able to login.')) return;
  try { await deleteDoc(doc(db, 'students', id)); } catch (err) { alert('Failed: ' + err.message); }
}

function showStudentError(msg) { const el = $('#student-error'); if (el) { el.textContent = msg; el.style.display = 'block'; } }
function clearStudentError() { const el = $('#student-error'); if (el) { el.textContent = ''; el.style.display = 'none'; } }

// === CALENDAR ===

function startClassesListener() {
  if (classesUnsubscribe) return;
  const q = query(collection(db, 'classes'), orderBy('date'));
  classesUnsubscribe = onSnapshot(q, (snap) => {
    classesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCalendar();
  });
}

function initCalendar() {
  const today = new Date();
  selectedDate = today;
  viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  $('#cal-prev')?.addEventListener('click', () => navigateMonth(-1));
  $('#cal-next')?.addEventListener('click', () => navigateMonth(1));
  $('#cal-today')?.addEventListener('click', () => {
    const t = new Date();
    viewMonth = new Date(t.getFullYear(), t.getMonth(), 1);
    selectedDate = t;
    renderCalendar();
  });
  $('#schedule-class-btn')?.addEventListener('click', () => openScheduleClassModal());
  renderCalendar();
}

function navigateMonth(delta) {
  viewMonth.setMonth(viewMonth.getMonth() + delta);
  renderCalendar();
}

function renderCalendar() {
  renderMonthGrid();
  renderDayDetail();
}

function renderMonthGrid() {
  const grid = $('#cal-grid');
  const label = $('#cal-month-label');
  if (!grid || !label) return;

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  label.textContent = MONTHS[month] + ' ' + year;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday=0
  const numDays = lastDay.getDate();
  const today = fmtDate(new Date());
  const sel = selectedDate ? fmtDate(selectedDate) : '';

  let html = 'MTWTFSS'.split('').map(d => '<div class="cal-hdr">' + d + '</div>').join('');
  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell cal-empty"></div>';

  for (let d = 1; d <= numDays; d++) {
    const ds = fmtDate(new Date(year, month, d));
    const count = classesForDate(ds).length;
    let cls = 'cal-cell';
    if (ds === today) cls += ' cal-today';
    if (ds === sel) cls += ' cal-selected';
    if (count > 0) cls += ' cal-has-classes';
    html += '<div class="' + cls + '" data-date="' + ds + '">' + d +
      (count > 0 ? '<span class="cal-dot">' + count + '</span>' : '') + '</div>';
  }

  grid.innerHTML = html;
  grid.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
    cell.addEventListener('click', () => selectDate(cell.dataset.date));
  });
}

function selectDate(dateStr) {
  const p = dateStr.split('-');
  selectedDate = new Date(+p[0], +p[1] - 1, +p[2]);
  renderCalendar();
}

function renderDayDetail() {
  const label = $('#cal-day-label');
  const container = $('#cal-day-classes');
  if (!label || !container) return;

  if (!selectedDate) {
    label.textContent = 'Select a day';
    container.innerHTML = '';
    return;
  }

  const ds = fmtDate(selectedDate);
  label.textContent = DAYS[selectedDate.getDay()] + ', ' + selectedDate.getDate() + ' ' + MONTHS[selectedDate.getMonth()];

  const classes = classesForDate(ds).sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (classes.length === 0) {
    container.innerHTML = '<p class="cal-empty-day">No classes scheduled.</p>';
    return;
  }

  let html = '';
  for (const c of classes) {
    const mode = c.mode === 'online' ? 'Online' : 'In-person';
    const done = c.status === 'completed';
    const cancelled = c.status === 'cancelled';
    let statusCls = done ? ' cal-class-done' : cancelled ? ' cal-class-cancelled' : '';
    const waLink = makeWaLink(c);

    html += '<div class="cal-class-item' + statusCls + '">' +
      '<div class="cal-class-time">' + fmtTime(c.time) + '</div>' +
      '<div class="cal-class-info">' +
        '<strong>' + esc(c.studentName) + '</strong> ' +
        '<span class="cal-class-mode">' + mode + '</span>' +
        (c.notes ? '<div class="cal-class-notes">' + esc(c.notes) + '</div>' : '') +
        (cancelled ? '<span class="cal-class-status">Cancelled</span>' : '') +
      '</div>' +
      '<div class="cal-class-actions">';

    if (!cancelled) {
      html += '<a href="' + waLink + '" target="_blank" rel="noopener" class="portal-btn-sm" title="WhatsApp reminder">📱</a>';
      if (!done) html += '<button class="portal-btn-sm portal-btn-edit" data-action="complete" data-id="' + c.id + '" title="Mark done">✓</button>';
      html += '<button class="portal-btn-sm portal-btn-edit" data-action="edit-class" data-id="' + c.id + '" title="Edit">✎</button>' +
        '<button class="portal-btn-sm portal-btn-delete" data-action="cancel-class" data-id="' + c.id + '" title="Cancel">✕</button>';
    }
    html += '</div></div>';
  }

  container.innerHTML = html;

  container.querySelectorAll('[data-action="complete"]').forEach(b => b.addEventListener('click', () => markComplete(b.dataset.id)));
  container.querySelectorAll('[data-action="cancel-class"]').forEach(b => b.addEventListener('click', () => cancelClass(b.dataset.id)));
  container.querySelectorAll('[data-action="edit-class"]').forEach(b => b.addEventListener('click', () => openEditClassModal(b.dataset.id)));
}

function classesForDate(ds) {
  return classesCache.filter(c => c.date === ds && c.status !== 'cancelled');
}

// === CLASSES ===

function initClassModal() {
  const closeBtn = $('#class-modal-close');
  const modal = $('#class-modal');
  const form = $('#class-form');
  if (closeBtn) closeBtn.addEventListener('click', closeClassModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeClassModal(); });
  if (form) form.addEventListener('submit', handleClassFormSubmit);
}

function openScheduleClassModal() {
  editingClassId = null;
  const form = $('#class-form');
  $('#class-modal-title').textContent = 'Schedule Class';
  form.reset();
  form.querySelector('[name="date"]').value = selectedDate ? fmtDate(selectedDate) : fmtDate(new Date());
  form.querySelector('[type="submit"]').textContent = 'Schedule';
  populateStudentDropdown(form.querySelector('[name="studentId"]'));
  clearClassError();
  $('#class-modal').style.display = 'flex';
}

function openEditClassModal(id) {
  const c = classesCache.find(x => x.id === id);
  if (!c) return;
  editingClassId = id;
  const form = $('#class-form');
  $('#class-modal-title').textContent = 'Edit Class';
  populateStudentDropdown(form.querySelector('[name="studentId"]'));
  form.querySelector('[name="studentId"]').value = c.studentId;
  form.querySelector('[name="date"]').value = c.date;
  form.querySelector('[name="time"]').value = c.time;
  form.querySelector('[name="mode"]').value = c.mode;
  form.querySelector('[name="notes"]').value = c.notes || '';
  form.querySelector('[type="submit"]').textContent = 'Save Changes';
  clearClassError();
  $('#class-modal').style.display = 'flex';
}

function closeClassModal() { hide($('#class-modal')); editingClassId = null; }

async function handleClassFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  clearClassError();

  const studentId = form.querySelector('[name="studentId"]').value;
  const student = studentsCache.find(s => s.id === studentId);
  if (!student) { showClassError('Please select a student.'); return; }

  const data = {
    studentId: student.id,
    studentName: student.name,
    studentWhatsapp: student.whatsapp || '',
    date: form.querySelector('[name="date"]').value,
    time: form.querySelector('[name="time"]').value,
    duration: 60,
    mode: form.querySelector('[name="mode"]').value,
    notes: form.querySelector('[name="notes"]').value.trim()
  };

  if (!data.date || !data.time || !data.mode) { showClassError('Please fill in all fields.'); return; }

  btn.disabled = true;

  if (editingClassId) {
    btn.textContent = 'Saving…';
    try {
      await updateDoc(doc(db, 'classes', editingClassId), data);
      closeClassModal();
    } catch (err) { showClassError('Failed: ' + err.message); }
    finally { btn.disabled = false; btn.textContent = 'Save Changes'; }
  } else {
    btn.textContent = 'Scheduling…';
    try {
      data.status = 'scheduled';
      data.fromRecurringSlot = null;
      data.whatsappSent = false;
      data.createdAt = Timestamp.now();
      await addDoc(collection(db, 'classes'), data);
      closeClassModal();
    } catch (err) { showClassError('Failed: ' + err.message); }
    finally { btn.disabled = false; btn.textContent = 'Schedule'; }
  }
}

async function markComplete(id) {
  try { await updateDoc(doc(db, 'classes', id), { status: 'completed' }); }
  catch (err) { alert('Failed: ' + err.message); }
}

async function cancelClass(id) {
  const c = classesCache.find(x => x.id === id);
  if (!c || !confirm('Cancel ' + c.studentName + '\'s class on ' + fmtDate(new Date(c.date)) + '?')) return;
  try { await updateDoc(doc(db, 'classes', id), { status: 'cancelled' }); }
  catch (err) { alert('Failed: ' + err.message); }
}

function populateStudentDropdown(sel) {
  if (!sel) return;
  sel.innerHTML = '<option value="">Select student…</option>';
  for (const s of studentsCache) {
    sel.innerHTML += '<option value="' + s.id + '">' + esc(s.name) + '</option>';
  }
}

function showClassError(msg) { const el = $('#class-error'); if (el) { el.textContent = msg; el.style.display = 'block'; } }
function clearClassError() { const el = $('#class-error'); if (el) { el.textContent = ''; el.style.display = 'none'; } }

function makeWaLink(c) {
  if (!c.studentWhatsapp) return '#';
  const d = new Date(c.date + 'T00:00:00');
  const day = DAYS[d.getDay()];
  const month = MONTHS[d.getMonth()];
  const msg = 'Namaste! Your sitar class is scheduled for ' + day + ', ' +
    d.getDate() + ' ' + month + ' at ' + fmtTime(c.time) +
    ' (' + (c.mode === 'online' ? 'Online' : 'In-person') + '). — SRK Academy of Music';
  return 'https://wa.me/' + c.studentWhatsapp.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(msg);
}

// === RECURRING SLOTS ===

function startRecurringListener() {
  if (recurringUnsubscribe) return;
  const q = query(collection(db, 'recurringSlots'), orderBy('dayOfWeek'));
  recurringUnsubscribe = onSnapshot(q, (snap) => {
    recurringCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderRecurringList();
    ensureRecurringClassesGenerated();
  });
}

function renderRecurringList() {
  const container = $('#recurring-list');
  if (!container) return;

  const active = recurringCache.filter(r => r.active !== false);
  if (active.length === 0) {
    container.innerHTML = '<div class="portal-placeholder"><h3>No Recurring Slots</h3><p>Set up weekly class schedules for students with fixed timings.</p></div>';
    return;
  }

  let html = '<div class="portal-table-wrap"><table class="portal-table">' +
    '<thead><tr><th>Student</th><th>Day</th><th>Time</th><th>Mode</th><th>Actions</th></tr></thead><tbody>';
  for (const r of active) {
    html += '<tr><td><strong>' + esc(r.studentName) + '</strong></td>' +
      '<td>' + DAYS[r.dayOfWeek] + '</td><td>' + fmtTime(r.time) + '</td>' +
      '<td>' + (r.mode === 'online' ? 'Online' : 'In-person') + '</td>' +
      '<td class="portal-table-actions">' +
      '<button class="portal-btn-sm portal-btn-delete" data-action="deactivate-recurring" data-id="' + r.id + '">Remove</button>' +
      '</td></tr>';
  }
  html += '</tbody></table></div>';
  container.innerHTML = html;

  container.querySelectorAll('[data-action="deactivate-recurring"]').forEach(b => {
    b.addEventListener('click', () => deactivateSlot(b.dataset.id));
  });
}

function initRecurringModal() {
  const addBtn = $('#add-recurring-btn');
  const closeBtn = $('#recurring-modal-close');
  const modal = $('#recurring-modal');
  const form = $('#recurring-form');
  if (addBtn) addBtn.addEventListener('click', openAddRecurringModal);
  if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  if (form) form.addEventListener('submit', handleRecurringFormSubmit);
}

function openAddRecurringModal() {
  const form = $('#recurring-form');
  form.reset();
  populateStudentDropdown(form.querySelector('[name="studentId"]'));
  clearRecurringError();
  $('#recurring-modal').style.display = 'flex';
}

async function handleRecurringFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  clearRecurringError();

  const studentId = form.querySelector('[name="studentId"]').value;
  const student = studentsCache.find(s => s.id === studentId);
  if (!student) { showRecurringError('Please select a student.'); return; }

  const data = {
    studentId: student.id,
    studentName: student.name,
    studentWhatsapp: student.whatsapp || '',
    dayOfWeek: parseInt(form.querySelector('[name="dayOfWeek"]').value, 10),
    time: form.querySelector('[name="time"]').value,
    duration: 60,
    mode: form.querySelector('[name="mode"]').value,
    active: true,
    createdAt: Timestamp.now()
  };

  if (isNaN(data.dayOfWeek) || !data.time || !data.mode) { showRecurringError('Please fill in all fields.'); return; }

  btn.disabled = true;
  btn.textContent = 'Creating…';
  try {
    const docRef = await addDoc(collection(db, 'recurringSlots'), data);
    await generateClassesFromSlot({ ...data, id: docRef.id });
    form.reset();
    $('#recurring-modal').style.display = 'none';
  } catch (err) { showRecurringError('Failed: ' + err.message); }
  finally { btn.disabled = false; btn.textContent = 'Add Recurring Slot'; }
}

async function deactivateSlot(id) {
  const r = recurringCache.find(x => x.id === id);
  if (!r || !confirm('Remove ' + r.studentName + '\'s recurring ' + DAYS[r.dayOfWeek] + ' slot? Future generated classes will remain on the calendar.')) return;
  try { await updateDoc(doc(db, 'recurringSlots', id), { active: false }); }
  catch (err) { alert('Failed: ' + err.message); }
}

function showRecurringError(msg) { const el = $('#recurring-error'); if (el) { el.textContent = msg; el.style.display = 'block'; } }
function clearRecurringError() { const el = $('#recurring-error'); if (el) { el.textContent = ''; el.style.display = 'none'; } }

async function generateClassesFromSlot(slot) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let week = 0; week < 4; week++) {
    const date = nextDayOfWeek(today, slot.dayOfWeek, week);
    if (date < today) continue;
    const ds = fmtDate(date);

    const exists = classesCache.some(c => c.fromRecurringSlot === slot.id && c.date === ds);
    if (exists) continue;

    await addDoc(collection(db, 'classes'), {
      studentId: slot.studentId,
      studentName: slot.studentName,
      studentWhatsapp: slot.studentWhatsapp || '',
      date: ds,
      time: slot.time,
      duration: slot.duration || 60,
      mode: slot.mode,
      status: 'scheduled',
      notes: '',
      fromRecurringSlot: slot.id,
      whatsappSent: false,
      createdAt: Timestamp.now()
    });
  }
}

async function ensureRecurringClassesGenerated() {
  for (const slot of recurringCache) {
    if (slot.active === false) continue;
    await generateClassesFromSlot(slot);
  }
}

function nextDayOfWeek(from, dow, weeksAhead) {
  const d = new Date(from);
  let diff = dow - d.getDay();
  if (diff < 0) diff += 7;
  d.setDate(d.getDate() + diff + weeksAhead * 7);
  return d;
}

// === STUDENT VIEW ===

function startStudentClassesListener() {
  if (classesUnsubscribe || !studentProfile) return;
  const q = query(collection(db, 'classes'), where('studentId', '==', studentProfile.id), orderBy('date'));
  classesUnsubscribe = onSnapshot(q, (snap) => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderStudentView(all);
  });
}

function renderStudentView(classes) {
  const container = $('#student-classes');
  if (!container) return;

  const today = fmtDate(new Date());
  const upcoming = classes.filter(c => c.date >= today && c.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const past = classes.filter(c => c.date < today && c.status !== 'cancelled').sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  let html = '<h3 class="portal-list-heading">Upcoming Classes</h3>';
  if (upcoming.length === 0) {
    html += '<p class="cal-empty-day">No upcoming classes scheduled.</p>';
  } else {
    for (const c of upcoming) {
      const d = new Date(c.date + 'T00:00:00');
      html += '<div class="student-class-item">' +
        '<span class="student-class-date">' + DAYS[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</span>' +
        '<span class="student-class-time">' + fmtTime(c.time) + '</span>' +
        '<span class="cal-class-mode">' + (c.mode === 'online' ? 'Online' : 'In-person') + '</span>' +
        '</div>';
    }
  }

  html += '<h3 class="portal-list-heading" style="margin-top:32px;">Past Classes</h3>';
  if (past.length === 0) {
    html += '<p class="cal-empty-day">No past classes yet.</p>';
  } else {
    for (const c of past.slice(0, 20)) {
      const d = new Date(c.date + 'T00:00:00');
      html += '<div class="student-class-item student-class-past">' +
        '<span class="student-class-date">' + DAYS[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</span>' +
        '<span class="student-class-time">' + fmtTime(c.time) + '</span>' +
        '<span class="cal-class-mode">' + (c.mode === 'online' ? 'Online' : 'In-person') + '</span>' +
        (c.status === 'completed' ? '<span class="student-class-done">✓</span>' : '') +
        '</div>';
    }
  }

  container.innerHTML = html;
}

// === HELPERS ===

function fmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'; }

// === HASH ===

function handleHash() {
  if (window.location.hash === '#portal') {
    setTimeout(() => {
      if (!currentUser) { $('#login-modal').style.display = 'flex'; }
    }, 800);
  }
}
