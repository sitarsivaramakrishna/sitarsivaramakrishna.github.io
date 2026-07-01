# Homepage — index.html

**URL**: sitarsiva.in  
**Lines**: ~400  
**Layout**: Single-page with hero + 4 content sections + footer

## Sections

| # | ID | Section | Description |
|---|-----|---------|-------------|
| 1 | `#home` | Hero | Split-layout: random solo portrait (left 45%), Sanskrit invocation + "Listen" CTA (right). 100vh. 5 photos rotate via `main.js` homeHeroes array. |
| 2 | `#explore` | Explore | 3 cards linking to sub-pages: The Sitarist (Shalle Bangalore concert photo bg), Aruna Music (aruna-logo), SRK Academy (srk-academy-logo-2026.svg). |
| 3 | `#about` | About the Artist | Biography narrative + 4 highlight cards (awards, albums, countries, mastery). |
| 4 | `#press` | Press & Reviews | The Hindu featured quote + 9 press clipping cards with lightbox. |
| 5 | `#contact` | Contact | Google Forms-backed form (name, email, subject dropdown, message). Honeypot + math CAPTCHA spam protection. Submissions emailed to sitarsiva@gmail.com. |
| 6 | — | Footer | Quick links, streaming links, Sanskrit closing verse. Personal social links (Instagram, Facebook, YouTube). |

## Key Assets
- Hero images: `assets/images/heroes/` (5 photos in rotation)
- Press images: `assets/images/press/` (16 files)
- Explore card backgrounds: `assets/images/gallery/concert-shalle-bangalore.webp`, `assets/images/aruna-logo.png`, `assets/images/srk-academy-logo-2026.svg`

## Notes
- Google Forms target: hidden iframe (`#hidden_iframe`) to keep user on page
- Lightbox (`#lightbox`) shared between press cards and gallery
- GA4 tracking: `G-JLHLLCTKT0`
- JSON-LD structured data: MusicGroup schema
