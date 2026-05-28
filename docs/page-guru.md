# Guru — guru.html

**URL**: sitarsiva.in/guru.html  
**Lines**: ~1180  
**Layout**: Sub-page with split-layout hero + 7 content sections + student portal  
**Sub-nav**: Guru & Lineage | The Academy | FAQ | Student Performances | Learn to Play Sitar | Testimonials | Portal (hidden until login)

## Sections

| # | ID | Section | Description |
|---|-----|---------|-------------|
| 1 | — | Page Header | Split-layout hero (70vh) with SRK Academy logo (srk-academy-logo-new.svg). "Student Portal" login button in hero. |
| 2 | `#guru` | Guru & Lineage | "Sri Gurubhyo Namaha" subtitle. Tribute to Ustad Ahmed Hussain Khan. Gharana lineage tree: Bande Ali Khan → Rahimat Khan → Ahmed Hussain Khan → Sivaramakrishna Rao. 3 guru photos. |
| 3 | `#academy` | The Academy | Personalized instruction description. Course Options (Beginner: 12 classes/quarter, Advanced/Professional: 13/11/9). Terms & Conditions (8 items). |
| 4 | `#faq` | FAQ | 41-item accordion organized in 2 groups: For Beginners (via `#beginners`) and For Intermediate Students (via `#intermediate`). Section nav buttons to jump between groups. Contact card at bottom. |
| 5 | `#performances` | Student Performances | 2 student performance videos displayed horizontally. |
| 6 | `#learn` | Learn to Play Sitar | 2 DVD videos (Vol 1 & 2) displayed horizontally, centered. |
| 7 | `#testimonials` | Testimonials | 4 student review images. |
| 8 | `#portal` | Student Portal | Firebase-based scheduling portal (hidden until login). See `docs/academy-portal-plan.md` for full details. |

## Key Assets
- Hero images: `assets/images/heroes/` (5 photos in rotation)
- SRK Academy logo: `assets/images/srk-academy-logo-new.svg`
- Guru photos: `assets/images/guru/` (3 photos)
- Portal JS: `js/portal.js` (source), `js/portal.min.js` (minified)
- 4 YouTube iframe embeds (students + DVDs)

## Notes
- FAQ accordion JS in `js/main.js`: one-at-a-time open behavior, aria-expanded management
- FAQ uses `.faq-section-nav` class (not `.section-nav`) to avoid CSS collision with sub-nav
- Portal nav link and section are hidden via `style="display: none;"` until Firebase auth completes
- Footer uses personal social links (same as homepage)
