/* ==========================================================================
   ExploreX — script.js
   Vanilla ES6, no dependencies. In-memory state only (no localStorage),
   since this file is previewed as a live document as well as run locally.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. Footer year
  --------------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     2. Navbar: background on scroll + smooth-scroll active link tracking
  --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScrollNav(){
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScrollNav, { passive:true });
  onScrollNav();

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------------------------------------------------------------------
     3. Mobile hamburger menu
  --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  }
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------------------------------------------------------------
     4. Smooth scroll for all in-page anchor links
  --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });

  /* ---------------------------------------------------------------------
     5. Hero image slider (auto-rotating)
  --------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('span');

  function goToSlide(index){
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  function nextSlide(){
    goToSlide((currentSlide + 1) % slides.length);
  }
  function startSlider(){
    sliderTimer = setInterval(nextSlide, 5500);
  }
  startSlider();

  /* ---------------------------------------------------------------------
     6. Scroll reveal animations (IntersectionObserver)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     7. Counter animation (stats strip)
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.6 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------------------
     8. Destination search / filter
  --------------------------------------------------------------------- */
  const searchInput = document.getElementById('destinationSearch');
  const destCards = document.querySelectorAll('.dest-card');
  const noResults = document.getElementById('noResults');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    destCards.forEach(card => {
      const haystack = card.dataset.name.toLowerCase();
      const match = haystack.includes(query);
      card.classList.toggle('hidden-card', !match);
      if (match) visibleCount++;
    });
    noResults.classList.toggle('show', visibleCount === 0);
  });

  /* ---------------------------------------------------------------------
     9. Booking modal (opened from nav, hero, package buttons)
  --------------------------------------------------------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalPackageSelect = document.getElementById('modalPackageSelect');
  const bookingForm = document.getElementById('bookingForm');
  const modalSuccess = document.getElementById('modalSuccess');

  function openModal(packageName){
    if (packageName){
      modalTitle.textContent = `Book: ${packageName}`;
      modalPackageSelect.value = packageName;
    } else {
      modalTitle.textContent = 'Book Your Adventure';
    }
    modalSuccess.classList.remove('show');
    bookingForm.style.display = 'flex';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('bookNowNav').addEventListener('click', () => openModal());
  document.getElementById('bookNowMobile').addEventListener('click', () => { closeMobileMenu(); openModal(); });
  document.getElementById('startJourneyBtn').addEventListener('click', () => openModal());
  document.querySelectorAll('.book-package').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.package));
  });
  document.querySelectorAll('.explore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#packages').scrollIntoView({ behavior:'smooth' });
    });
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    modalSuccess.classList.add('show');
    setTimeout(() => { closeModal(); bookingForm.reset(); }, 2200);
  });

  /* ---------------------------------------------------------------------
     10. Contact form + newsletter (front-end only demo confirmation)
  --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactNote = document.getElementById('contactNote');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactNote.textContent = '✓ Message sent — we typically reply within a day.';
    contactForm.reset();
  });

  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.placeholder = 'Subscribed ✓';
    input.value = '';
  });

  /* ---------------------------------------------------------------------
     11. Testimonial carousel dots
  --------------------------------------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonialDots');

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior:'smooth' });
    });
    dotsContainer.appendChild(dot);
  });
  const tDots = dotsContainer.querySelectorAll('span');

  track.addEventListener('scroll', () => {
    let closestIndex = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - track.scrollLeft - track.offsetLeft);
      if (dist < closestDist){ closestDist = dist; closestIndex = i; }
    });
    tDots.forEach(d => d.classList.remove('active'));
    tDots[closestIndex].classList.add('active');
  }, { passive:true });

  /* ---------------------------------------------------------------------
     12. Dark / light mode toggle (in-memory only — no storage APIs)
  --------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark){
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '☾';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀';
    }
  });

  /* ---------------------------------------------------------------------
     13. Back-to-top button
  --------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 700);
  }, { passive:true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ---------------------------------------------------------------------
     14. Journey line marker — travels along the dashed route on scroll
  --------------------------------------------------------------------- */
  const journeyPath = document.getElementById('journeyPath');
  const journeyMarker = document.getElementById('journeyMarker');
  const journeyLine = document.getElementById('journeyLine');
  const pathLength = journeyPath.getTotalLength();

  function updateJourneyMarker(){
    const lineTop = journeyLine.getBoundingClientRect().top + window.scrollY;
    const lineHeight = journeyLine.getBoundingClientRect().height;
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let progress = (scrollMid - lineTop) / lineHeight;
    progress = Math.max(0, Math.min(1, progress));
    const point = journeyPath.getPointAtLength(progress * pathLength);
    journeyMarker.style.top = `${lineTop + point.y}px`;
    journeyMarker.style.left = `calc(50% + ${point.x - 2}px)`;
  }
  window.addEventListener('scroll', updateJourneyMarker, { passive:true });
  window.addEventListener('resize', updateJourneyMarker);
  updateJourneyMarker();

  /* ---------------------------------------------------------------------
     15. Parallax band
  --------------------------------------------------------------------- */
  const parallaxLayer = document.querySelector('.parallax-layer');
  const parallaxBand = document.getElementById('parallaxBand');

  function updateParallax(){
    if (!parallaxBand) return;
    const rect = parallaxBand.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const speed = parseFloat(parallaxLayer.dataset.speed);
    const offset = (rect.top) * speed;
    parallaxLayer.style.transform = `translateY(${offset}px)`;
  }
  window.addEventListener('scroll', updateParallax, { passive:true });
  updateParallax();

  /* ---------------------------------------------------------------------
     16. Ambient particle background (subtle floating dust)
  --------------------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrame;

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles(){
    const count = Math.min(70, Math.floor(window.innerWidth / 20));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.3 + 0.05,
      drift: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1
    }));
  }

  function drawParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(217,154,68,0.6)';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10){ p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    });
    ctx.globalAlpha = 1;
    animationFrame = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createParticles();
      updateJourneyMarker();
    }, 250);
  });

});
