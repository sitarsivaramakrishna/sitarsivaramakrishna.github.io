# Moments — moments.html

**URL**: sitarsiva.in/moments.html  
**Lines**: ~530  
**Layout**: Sub-page with split-layout hero + 4 gallery sections  
**Sub-nav**: With Other Artists | With Students | Concert Pictures | Awards

## Sections

| # | ID | Section | Description |
|---|-----|---------|-------------|
| 1 | — | Page Header | Split-layout hero (70vh). |
| 2 | `#artists` | With Other Artists | Photos with celebrated musicians: Hariharan, Ustad Shahid Parvez, Ustad Rashid Khan, Bombay Jayashree, Dr. Balamuralikrishna, Devi Sri Prasad, Lydian Nadhaswaram, and others. |
| 3 | `#students` | With Students | 4 student photos, centered layout. |
| 4 | `#concerts` | Concert Pictures | Concert and international performance photos: Shalle Bangalore, Drive East NY, Basel, Stanford, Google SF, German Embassy Berlin, Melbourne, Shenyang China, Europe Tour 2024 (France), and more. Includes former hero background images. |
| 5 | `#awards` | Awards | 2 award photos centered: Madhura Murali Puraskar, Nada Chintamani Award. |

## Key Assets
- Hero images: `assets/images/heroes/` (5 photos in rotation)
- Gallery photos: `assets/images/gallery/` (full-size) + `gallery/thumbs/` (400px WebP thumbnails)
- ~83 gallery items total across all sections
- Lightbox (`#lightbox`) for full-size image viewing

## Notes
- All photos use thumb/full-size pattern: `<img src="thumbs/..." data-full="...">` for performance
- International photos are within the Concert Pictures section (no separate section header)
- No YouTube embeds on this page — photos only
- Footer uses personal social links (same as homepage)
