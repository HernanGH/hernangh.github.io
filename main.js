// ── Theme Toggle ──────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

// ── Navbar Scroll Effect ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hamburger Menu ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── Scroll Reveal Animation ───────────────────────────
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger skill bars
        if (entry.target.classList.contains('skill-card')) {
          entry.target.classList.add('revealed');
        }
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ── Typing Animation ──────────────────────────────────
const typingElement = document.getElementById('typing-text');
const phrases = [
  'React · TypeScript · Node.js · AWS',
  'Building scalable products 🚀',
  'AWS Community Builder 2026 ☁️',
  'FullStack Professor en Coderhouse 🎓',
  'Buenos Aires, Argentina 🇦🇷'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 60;

function typeEffect() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typingElement.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 30;
  } else {
    typingElement.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 60;
  }

  if (!isDeleting && charIndex === current.length) {
    typingSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 400;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ── Active Nav Link on Scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
);

sections.forEach(section => sectionObserver.observe(section));

// ── Contact Form ──────────────────────────────────────
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  const originalText = btn.textContent;
  btn.textContent = '¡Mensaje enviado! ✅';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.pointerEvents = '';
    contactForm.reset();
  }, 3000);
});

// ── Smooth Scroll for All Anchor Links ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
