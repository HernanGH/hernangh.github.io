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

// ── Language Switcher ─────────────────────────────────
const languageSelector = document.getElementById('language-selector');
let currentLang = localStorage.getItem('userLang') || 'es';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('userLang', lang);
  
  document.documentElement.lang = lang;
  if (languageSelector) {
    languageSelector.value = lang;
  }

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else {
        element.innerHTML = translations[lang][key];
      }
    }
  });

  if (typeof typedPhrases !== 'undefined' && typingElement) {
    phrases = typedPhrases[lang] || typedPhrases['es'];
    clearTimeout(typingTimeout);
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
    typingElement.textContent = '';
    typeEffect();
  }
}

if (languageSelector) {
  languageSelector.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
}

// ── Typing Animation ──────────────────────────────────
const typingElement = document.getElementById('typing-text');
let phrases = typeof typedPhrases !== 'undefined' 
  ? (typedPhrases[currentLang] || typedPhrases['es']) 
  : [
      'React · TypeScript · Node.js',
      'Building scalable products 🚀',
      'FullStack Professor en Coderhouse 🎓',
      'Buenos Aires, Argentina 🇦🇷'
    ];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 60;
let typingTimeout;

function typeEffect() {
  if (!phrases || !phrases.length) return;
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

  typingTimeout = setTimeout(typeEffect, typingSpeed);
}

// Initial language load
setLanguage(currentLang);

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

// ── Contact Form → Firebase Firestore ─────────────────
const contactForm = document.getElementById('contact-form');

async function handleContactSubmit(e) {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  const originalText = btn.textContent;

  // Validate Firebase is loaded
  if (!window.firebaseDB) {
    btn.textContent = 'Error: Firebase no cargó ❌';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.pointerEvents = '';
    }, 3000);
    return;
  }

  const { db, collection, addDoc, serverTimestamp } = window.firebaseDB;

  // Show loading state
  btn.textContent = 'Enviando... ⏳';
  btn.style.pointerEvents = 'none';
  btn.disabled = true;

  try {
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    await addDoc(collection(db, 'contactMessages'), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      read: false
    });

    btn.textContent = '¡Mensaje enviado! ✅';
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.pointerEvents = '';
      btn.disabled = false;
    }, 3000);
  } catch (error) {
    console.error('Error sending message:', error);
    btn.textContent = 'Error al enviar ❌';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.pointerEvents = '';
      btn.disabled = false;
    }, 3000);
  }
}

contactForm.addEventListener('submit', handleContactSubmit);

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
