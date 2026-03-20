# Sitar Siva Website — Task List

## Status Legend
- [ ] Not started
- [x] Completed
- [~] In progress

---

## Phase 0: Planning & Setup
- [x] Finalize hosting approach — GitHub Pages
- [x] Decide on URL — https://sitarsivaramakrishna.github.io (org: sitarsivaramakrishna)
- [x] Choose tech stack — plain HTML + CSS + vanilla JS
- [x] Set up GitHub repository (sitarsivaramakrishna/sitarsivaramakrishna.github.io)
- [x] Set up project scaffolding (index.html, css/, js/, assets/)
- [x] Gather YouTube video links — cataloged ~100 videos across 2 channels using yt-dlp
- [x] Copy/optimize photos from Google Drive into project assets (52 photos, ~5MB)
- [x] Initial deployment to GitHub Pages (force-pushed over old Jekyll content)

---

## Phase 1: Core Pages & Structure

### 1.1 Home / Landing Page
- [x] Hero section with Hyderabad Palace concert photo and Sanskrit invocation
- [x] Brief introduction (tagline: Sitarist, Composer, Guru)
- [x] Navigation bar (responsive hamburger menu on mobile)
- [x] CTA buttons (Listen, Know More)
- [x] Scroll indicator
- [ ] Upcoming events / latest news ticker
- [x] Footer with social links, streaming platform icons, copyright

### 1.2 About / Biography Section
- [x] Detailed biography narrative
- [x] Photo of the artist (Chennai Festival performance)
- [x] Awards & recognition highlight cards (4 items)
- [x] International performance mention in bio text
- [x] Note: "fondly called Sitar Siva by friends" (not "known as")
- [ ] Timeline or milestones format (could enhance later)

### 1.3 Guru / Lineage Section
- [x] Tribute to Ustad Ahmed Hussain Khan (with photo)
- [x] About the Mian Achpal and Senia Gharana
- [x] Guru's training lineage tree: Bande Ali Khan → Rahimat Khan → Ahmed Hussain Khan → Sivaramakrishna Rao
- [ ] Photo of Ustad Rahimat Khan at Dharwar (available in assets but not yet on page)
- [x] Historical significance of Rahimat Khan (kharaj-shadaj string invention)
- [x] Guru-Shishya parampara explanation

### 1.4 Music / Videos Section
- [x] 21 YouTube video embeds total across all sections
- [x] Categorized: Solo Classical (3), Carnatic on Sitar (3), Fusion & Covers (3), Devotional (3)
- [x] Responsive video grid layout
- [x] Video titles and brief descriptions
- [x] Streaming platform links section (Spotify, Apple Music, Amazon, JioSaavn, YouTube)
- [ ] Album grid/list with cover art, year, label
- [ ] Embedded Spotify player widgets for select albums
- [ ] Audio samples from WAV files

### 1.5 Gallery Section
- [x] Photo gallery with lightbox functionality (click to expand, keyboard nav)
- [x] Categories with filter buttons: All, Concerts, With Artists, International, Awards
- [x] Captions for each photo (from filename descriptions)
- [x] Lazy loading (native browser loading="lazy")
- [x] Hover-to-reveal captions
- [x] 40+ photos displayed including Europe Tour 2024 photos
- [ ] Create optimized thumbnails for faster loading

### 1.6 Basavaraj Brothers Section
- [x] About the duo (Sitar + Violin)
- [x] Photos of the brothers performing (Hyderabad Palace)
- [x] Description of Jugalbandi style (Carnatic + Hindustani fusion)
- [x] Link to basavarajbrothers.com
- [x] 6 embedded videos of their performances
- [x] Albums mentioned (Living Colours, Live in Paris with Nadaka)

### 1.7 Ateetam Section
- [x] About the band — meaning of "Ateetam" (THE BEYOND, Sanskrit)
- [x] 4 member cards (Sivaramakrishna Rao, Shakthidhar, Venky DC, Varun Pradeep)
- [x] Albums listed in description
- [x] 2 embedded videos (Ateetam Live, Shivanjali)
- [ ] Links to individual member websites (shakthidhar.com, venkydc.com)
- [ ] Member photos on cards

### 1.8 SRK Academy Section
- [x] About the academy / teaching practice
- [x] What is taught: Hindustani & Carnatic Classical on Sitar
- [x] Online classes mentioned
- [x] Instructional DVDs: "Learn To Play Sitar" Vol 1 & 2
- [x] Student performance video embed
- [ ] Student testimonials
- [ ] Sitar & accessories info

### 1.9 Press & Reviews Section
- [x] The Hindu quote (Chennai Music Season 2005)
- [x] 9 press clipping cards with images (Deccan Herald, TOI, Eenadu, German paper, Karthik Fine Arts, Indian Embassy Berlin, Colombo, Dhwani, French newspaper 2024)
- [x] Click to expand press clippings in lightbox
- [ ] Add readable text versions of scanned press clippings

### 1.10 Contact Section
- [x] Contact form (name, email, subject dropdown, message)
- [x] Social media links (Facebook, YouTube, Instagram, LinkedIn, Spotify)
- [x] Location: Bangalore, India
- [x] Subject options: Sitar Lessons, Collaboration, Concert Info, Other
- [x] Contact form wired to Google Forms (submissions emailed to sitarsiva@gmail.com)
- [x] Hidden iframe submission — users stay on page, see thank-you message
- [ ] Add email address

---

## Phase 2: Design & Theme

### 2.1 Visual Theme
- [x] Color palette: maroon (#6B0F1A), gold (#C9A84C), cream (#FDF6E3), warm white, teal
- [x] Decorative elements: Sanskrit ornaments (✿), gold dividers, gradient overlays
- [x] Typography: Playfair Display (headings) + Lora (body) from Google Fonts
- [x] Warm, inviting scheme befitting Indian classical music and spirituality
- [ ] Background textures (subtle silk/fabric patterns)
- [ ] Sitar silhouette imagery as design accents

### 2.2 Responsive Design
- [x] Breakpoints at 968px, 768px, 480px
- [x] Hamburger navigation menu on small screens
- [x] Flexible image grids
- [x] Responsive video embeds (16:9 via padding-bottom trick)
- [x] Readable text at all viewport widths
- [ ] Touch-friendly gallery (swipe navigation)

### 2.3 Animations & Interactions
- [x] Smooth scroll navigation (CSS scroll-behavior)
- [x] Fade-in animations on scroll (IntersectionObserver)
- [x] Hover effects on gallery images, cards, and buttons
- [x] Active nav link highlighting on scroll

---

## Phase 3: Special Features

### 3.1 Streaming Integration
- [x] Links to all 5 major streaming platforms with styled buttons
- [ ] Spotify embed widget for featured tracks
- [ ] Custom audio player for WAV samples

### 3.2 YouTube Video Embeds
- [x] 21 iframes with native lazy loading
- [x] Responsive embed containers (16:9 aspect ratio)
- [x] Curated selection across categories
- Note: YouTube embeds require http/https — do NOT work from file:// protocol

### 3.3 Photo Gallery with Lightbox
- [x] Grid layout with hover captions
- [x] Full-screen lightbox on click
- [x] Previous/next navigation (buttons + arrow keys)
- [x] Keyboard support (Escape to close, arrows to navigate)
- [x] Category filtering (All/Concerts/With Artists/International/Awards)
- [x] Click-outside-to-close

### 3.4 SEO & Metadata
- [x] Meta tags (title, description, keywords)
- [x] Open Graph tags for social sharing
- [x] Structured data (JSON-LD) for MusicGroup schema
- [x] Sitemap.xml
- [x] robots.txt
- [x] Favicon (sitar-themed SVG + PNG fallbacks)
- [x] Canonical URL and robots meta tag
- [x] Twitter Card meta tags
- [x] Google Search Console verification tag
- [x] Expanded keywords meta tag

### 3.5 Performance
- [x] Native lazy loading for images and iframes
- [x] Small image sizes (~5MB total for 52 photos)
- [ ] WebP format conversion
- [ ] Minified CSS/JS
- [ ] Optimized thumbnails

### 3.6 Analytics
- [x] Google Analytics (GA4) integration — Measurement ID: G-JLHLLCTKT0

---

## Phase 4: Content & Assets

### 4.1 Photos
- [x] Copied 48 photos from SIVA Photo Gallery
- [x] Copied 1 award photo
- [x] Copied 3 guru photos
- [x] Copied 16 press review files
- [x] Copied 4 Europe Tour 2024 photos from WhatsApp share folder
- [x] Renamed gallery files to web-friendly names (lowercase, hyphens)
- [ ] Create optimized thumbnails

### 4.2 Written Content
- [x] Biography text written (from docx + web research)
- [x] Guru tribute content written
- [x] Basavaraj Brothers description written
- [x] Ateetam description written
- [x] SRK Academy description written
- [ ] Detailed album descriptions

### 4.3 Video Content
- [x] Cataloged ~100 YouTube videos across both channels (yt-dlp)
- [x] Curated 21 videos for embedding across sections
- [x] Organized by: Solo Classical, Carnatic, Fusion, Devotional, Brothers, Ateetam, Academy

---

## Phase 5: Polish & Launch

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing
- [ ] Accessibility audit (alt text, contrast, keyboard nav)
- [ ] Spell check all content
- [ ] Final review with the artist
- [x] Deploy to GitHub Pages
- [x] Set up custom domain — sitarsiva.in (GoDaddy, DNS A records + CNAME configured)
- [x] CNAME file added to repo for GitHub Pages custom domain
- [x] HTTPS enforced (Let's Encrypt certificate provisioned by GitHub)
- [x] Submit to Google Search Console (verified, sitemap submitted)

---

## Nice-to-Have / Future Enhancements
- [ ] Blog/news section for upcoming concerts and releases
- [ ] Event calendar with past and upcoming performances
- [ ] Mailing list signup
- [ ] Multi-language support (English + Hindi or Telugu)
- [ ] Online store for DVDs, albums, merchandise
- [ ] Student portal for SRK Academy
- [ ] Interactive sitar learning resources
- [ ] Audio visualizer for embedded music
- [ ] Dark/light theme toggle
- [ ] "Raga of the Day" feature
- [ ] Guest book / visitor comments
- [ ] Interactive map of international performances
- [ ] Collaboration request form for other musicians
- [ ] Integration with concert booking platforms
- [ ] Discography page with album cover art grid
- [ ] Embed Spotify/Apple Music player widgets
- [ ] Use remaining WhatsApp photos from Europe Tour 2024
