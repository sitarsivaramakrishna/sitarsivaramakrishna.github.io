# sitarsiva.in

Official website for **B. Sivaramakrishna Rao** (Sitar Siva) — Sitarist, Composer, and Guru.

Disciple of Ustad Ahmed Hussain Khan of the Mian Achpal and Senia Gharana. Founder of Aruna Music Entertainment and the SRK Academy of Music.

## Live Site

- **https://sitarsiva.in**
- Hosted on GitHub Pages with custom domain

## Pages

- **Home** (`index.html`) — Hero, upcoming concerts, biography, press reviews, contact form
- **Sitarist** (`sitarist.html`) — Raga Dictionary, solo classical performances, Basavaraj Brothers, Ateetam
- **Composer** (`composer.html`) — Aruna Music Entertainment: about, 5 production projects, photo gallery
- **Guru** (`guru.html`) — Guru lineage, SRK Academy of Music, testimonials, student portal

## Student Portal

Scheduling portal on the Guru page (`guru.html#portal`) for managing sitar classes.

- **Guruji (teacher)** — calendar, student management, recurring/one-off scheduling, WhatsApp reminders via wa.me/ links
- **Students** — read-only view of their own upcoming and past classes
- **Backend** — Firebase Auth + Firestore (free tier)

## Tech Stack

Plain HTML + CSS + vanilla JavaScript. No frameworks or build tools.

- Firebase Auth + Firestore for the student portal
- WebP images with lazy loading and thumbnails
- CSS/JS minified via Python (`csscompressor`, `rjsmin`)
- Google Analytics (GA4), SEO with JSON-LD structured data
- Contact form via Google Forms

## Local Development

```bash
python3 -m http.server 8888
```

Then open http://localhost:8888

## Built by

Bharadwaj — student of Sri B. Sivaramakrishna Rao
