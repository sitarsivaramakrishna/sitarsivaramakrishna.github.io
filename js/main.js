/* === Random Hero Background === */
(function() {
  var heroes = [
    'assets/images/heroes/hero-hyderabad-palace.webp',
    'assets/images/heroes/hero-drive-east-ny.webp',
    'assets/images/heroes/hero-basel-concert.webp',
    'assets/images/heroes/hero-stanford-sanjose.webp',
    'assets/images/heroes/hero-bharat-sangeet-utsav.webp',
    'assets/images/heroes/hero-shalle-bangalore.webp',
    'assets/images/heroes/hero-jugalbandhi-concert.webp'
  ];
  var bg = document.querySelector('.hero-bg');
  if (bg) {
    var img = heroes[Math.floor(Math.random() * heroes.length)];
    bg.style.backgroundImage = 'url(' + img + ')';
  }
})();

/* === Navigation === */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* === Sub-navigation scroll highlighting === */
const subNav = document.querySelector('.sub-nav');
if (subNav) {
  const subNavLinks = subNav.querySelectorAll('a[href^="#"]');
  const offset = 120;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + offset;
    subNavLinks.forEach(link => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      const top = target.offsetTop;
      const height = target.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

/* === Fade-in on scroll === */
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

/* === Lazy load YouTube iframes === */
document.querySelectorAll('.video-wrapper').forEach(wrapper => {
  const iframe = wrapper.querySelector('iframe');
  if (iframe && iframe.dataset.src) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          videoObserver.unobserve(wrapper);
        }
      });
    }, { rootMargin: '200px' });
    videoObserver.observe(wrapper);
  }
});

/* === Gallery Lightbox === */
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const galleryItems = document.querySelectorAll('.gallery-item');
let currentGalleryIndex = 0;
let filteredItems = [...galleryItems];

function openLightbox(index) {
  currentGalleryIndex = index;
  const item = filteredItems[index];
  if (!item) return;
  const img = item.querySelector('img');
  const caption = item.querySelector('.gallery-caption');
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentGalleryIndex = (currentGalleryIndex + dir + filteredItems.length) % filteredItems.length;
  openLightbox(currentGalleryIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    filteredItems = [...document.querySelectorAll('.gallery-item:not([style*="display: none"])')];
    const idx = filteredItems.indexOf(item);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

/* === Gallery Filters === */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    filteredItems = [...document.querySelectorAll('.gallery-item:not([style*="display: none"])')];
  });
});

/* === Press card lightbox (reuse gallery lightbox) === */
document.querySelectorAll('.press-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.querySelector('h4');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxCaption.textContent = title ? title.textContent : '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

/* === Contact Form CAPTCHA & Submission === */
var captchaA, captchaB;
function generateCaptcha() {
  captchaA = Math.floor(Math.random() * 10) + 1;
  captchaB = Math.floor(Math.random() * 10) + 1;
  var label = document.getElementById('captcha-label');
  if (label) label.textContent = 'What is ' + captchaA + ' + ' + captchaB + '?';
}
if (document.getElementById('captcha-label')) generateCaptcha();

function submitContactForm(form) {
  // Honeypot check
  if (document.getElementById('hp-field').value) return false;
  // CAPTCHA check
  var answer = parseInt(document.getElementById('captcha-answer').value, 10);
  if (answer !== captchaA + captchaB) {
    alert('Incorrect answer. Please try again.');
    generateCaptcha();
    document.getElementById('captcha-answer').value = '';
    return false;
  }
  setTimeout(function() {
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 500);
  return true;
}
