/* ============================================================
   SMILE BEAUTY SALON – Premium Vanilla JavaScript
   ============================================================ */

'use strict';

/* ── DOM Ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initIntroScreen(); // Must run first — shows intro video
  initNavbar();
  initMobileMenu();
  initHero();
  initScrollReveal();
  initCounters();
  initGallery();
  initLightbox();
  initTestimonials();
  initBookingForm();
  initFAQ();
  initBackToTop();
  initParallax();
});

/* ============================================================
   INTRO VIDEO SCREEN
   ============================================================ */
function initIntroScreen() {
  const screen   = document.getElementById('introScreen');
  const video    = document.getElementById('introVideo');
  const skipBtn  = document.getElementById('introSkip');
  const progress = document.getElementById('introProgress');
  const curtainL = document.getElementById('curtainLeft');
  const curtainR = document.getElementById('curtainRight');
  if (!screen || !video) return;

  // Lock body scroll while intro plays
  document.body.classList.add('intro-active');

  // Show letterbox bars
  setTimeout(() => screen.classList.add('letterbox'), 50);


  // Track progress bar
  const updateProgress = () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progress) progress.style.width = pct + '%';
  };
  video.addEventListener('timeupdate', updateProgress);

  // Start playing (handle autoplay restrictions)
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  // The curtain wipe → hide intro → reveal site
  const doTransition = () => {
    // Prevent double-trigger
    if (screen.classList.contains('hiding')) return;
    screen.classList.add('hiding');

    // Pause the intro video
    video.pause();

    // 1. Curtains sweep IN from both sides to cover the intro
    curtainL.classList.add('sweep-in');
    curtainR.classList.add('sweep-in');

    setTimeout(() => {
      // 2. Hide intro screen
      screen.style.display = 'none';

      // 3. Unlock body
      document.body.classList.remove('intro-active');

      // 4. Curtains sweep OUT to reveal the website
      curtainL.classList.remove('sweep-in');
      curtainR.classList.remove('sweep-in');
      curtainL.classList.add('sweep-out');
      curtainR.classList.add('sweep-out');

      // 5. Remove curtains from DOM after animation
      setTimeout(() => {
        curtainL.style.display = 'none';
        curtainR.style.display = 'none';
      }, 800);

    }, 600); // wait for curtains to fully close
  };

  // Trigger on video end
  video.addEventListener('ended', doTransition);

  // Trigger on Skip click
  skipBtn && skipBtn.addEventListener('click', doTransition);
}


/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}`
        ? 'var(--gold)'
        : '';
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  if (!hamburger) return;

  const toggle = (open) => {
    hamburger.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open);
  };

  hamburger.addEventListener('click', () => toggle(!mobileNav.classList.contains('open')));
  overlay.addEventListener('click', () => toggle(false));

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

/* ============================================================
   HERO – Ken Burns Effect
   ============================================================ */
function initHero() {
  const hero = document.getElementById('hero');
  const video = document.getElementById('heroBg');
  if (!hero) return;

  // Ken Burns entrance
  setTimeout(() => hero.classList.add('loaded'), 100);

  // Ensure autoplay on mobile / restrictive browsers
  if (video && video.tagName === 'VIDEO') {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked – video will still show first frame
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOut(progress) * target;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   GALLERY FILTER
   ============================================================ */
function initGallery() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (!lightbox) return;

  let images = [];
  let currentIdx = 0;

  const openLightbox = (src, alt, idx) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    currentIdx = idx;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigate = (dir) => {
    currentIdx = (currentIdx + dir + images.length) % images.length;
    const img = images[currentIdx];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.opacity = '1';
    }, 150);
    lightboxImg.style.transition = 'opacity 0.3s ease';
  };

  // Gather all gallery images
  document.querySelectorAll('.gallery-item img').forEach((img, idx) => {
    images.push({ src: img.src, alt: img.alt });
    img.closest('.gallery-item').addEventListener('click', () => openLightbox(img.src, img.alt, idx));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  let idx = 0;
  let autoInterval;
  let perView = getPerView();

  function getPerView() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  const maxIdx = () => Math.max(0, total - perView);

  // Build dots
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    const numDots = maxIdx() + 1;
    for (let i = 0; i <= maxIdx(); i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === idx ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  };

  const goTo = (newIdx) => {
    idx = Math.max(0, Math.min(newIdx, maxIdx()));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${idx * cardWidth}px)`;
    updateDots();
  };

  const prev = () => goTo(idx > 0 ? idx - 1 : maxIdx());
  const next = () => goTo(idx < maxIdx() ? idx + 1 : 0);

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  const startAuto = () => {
    autoInterval = setInterval(next, 4000);
  };
  const resetAuto = () => {
    clearInterval(autoInterval);
    startAuto();
  };

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  const handleResize = () => {
    const newPer = getPerView();
    if (newPer !== perView) {
      perView = newPer;
      idx = 0;
      buildDots();
    }
    goTo(idx);
  };

  buildDots();
  goTo(0);
  startAuto();
  window.addEventListener('resize', handleResize, { passive: true });
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('fdate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  const validate = () => {
    let valid = true;

    const fields = [
      { id: 'fname', errId: 'fnameErr', check: v => v.trim().length > 1 },
      { id: 'fphone', errId: 'fphoneErr', check: v => /^[\d\s\+\-]{7,15}$/.test(v.trim()) },
      { id: 'fservice', errId: 'fserviceErr', check: v => v !== '' },
      { id: 'fdate', errId: 'fdateErr', check: v => v !== '' },
    ];

    fields.forEach(({ id, errId, check }) => {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      const ok = check(el.value);
      el.classList.toggle('error', !ok);
      err.classList.toggle('show', !ok);
      if (!ok) valid = false;
    });

    return valid;
  };

  // Real-time validation
  ['fname', 'fphone', 'fservice', 'fdate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', validate);
      el.addEventListener('change', validate);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn = document.getElementById('formSubmitBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Build WhatsApp message
    const name = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();
    const service = document.getElementById('fservice').options[document.getElementById('fservice').selectedIndex].text;
    const date = document.getElementById('fdate').value;
    const time = document.getElementById('ftime').value;
    const msg = document.getElementById('fmessage').value.trim();

    const waText = encodeURIComponent(
      `Hello Smile Beauty Salon!\n\n` +
      `*New Appointment Request*\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `💄 Service: ${service}\n` +
      `📅 Date: ${date}` + (time ? `\n🕐 Time: ${time}` : '') +
      (msg ? `\n\n📝 Message: ${msg}` : '') +
      `\n\nPlease confirm my appointment. Thank you!`
    );

    // Simulate form submission then open WhatsApp
    setTimeout(() => {
      form.style.display = 'none';
      successMsg.classList.add('show');
      window.open(`https://wa.me/917418030622?text=${waText}`, '_blank');
    }, 1200);
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });

    // Keyboard support
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   PARALLAX (Hero Background)
   ============================================================ */
function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      // Combine scale(1.05) with vertical translate for parallax
      heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
    }
  }, { passive: true });
}

/* ============================================================
   SERVICE CARD ICON ANIMATION
   ============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.service-icon');
    icon.style.transition = 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
});

/* ============================================================
   SMOOTH INTERNAL LINK SCROLLING (offset for navbar)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   CURSOR GLOW EFFECT (Desktop Only)
   ============================================================ */
if (window.innerWidth > 1024) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(200,161,101,0.06) 0%, transparent 70%);
    pointer-events:none; z-index:9999; transform:translate(-50%,-50%);
    transition:left 0.15s ease, top 0.15s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ============================================================
   PAGE LOAD PROGRESS INDICATOR
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed; top:0; left:0; height:2px;
  background:linear-gradient(90deg, var(--gold), var(--rose-gold));
  z-index:10000; transition:width 0.3s ease;
  width:0%;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });
