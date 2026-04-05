function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) return;

  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      navbarContainer.innerHTML = data;
      setNavbarActiveLink();
    })
    .catch(error => console.error('Error loading navbar:', error));
}

function setNavbarActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

const sections = document.querySelectorAll('main section');
const heroButtons = document.querySelectorAll('.hero-actions a');
const cube = document.getElementById('cube');
const interactiveZone = document.getElementById('interactive-zone');

function revealSections() {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      section.classList.add('visible');
    }
  });
}

function setActiveLink() {
  const offset = window.scrollY + window.innerHeight / 2;
  sections.forEach((section) => {
    const id = section.id;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (offset >= sectionTop && offset < sectionBottom) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initSmoothScroll() {
  const anchors = [...navLinks, ...heroButtons];
  anchors.forEach((anchor) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId?.startsWith('#')) return;
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initCubeInteraction() {
  if (!cube || !interactiveZone) return;

  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let rotationX = -14;
  let rotationY = 34;

  const updateCubeTransform = () => {
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const startDrag = (x, y) => {
    isDragging = true;
    lastX = x;
    lastY = y;
    cube.style.transition = 'transform 0.08s ease';
  };

  const moveDrag = (x, y) => {
    if (!isDragging) return;
    const dx = x - lastX;
    const dy = y - lastY;
    rotationY += dx * 0.25;
    rotationX -= dy * 0.25;
    rotationX = Math.max(-55, Math.min(55, rotationX));
    lastX = x;
    lastY = y;
    updateCubeTransform();
  };

  const endDrag = () => {
    isDragging = false;
    cube.style.transition = 'transform 0.4s ease';
  };

  interactiveZone.addEventListener('mousedown', (event) => startDrag(event.clientX, event.clientY));
  interactiveZone.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }
  });
  window.addEventListener('mousemove', (event) => moveDrag(event.clientX, event.clientY));
  window.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }
  }, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
  window.addEventListener('mouseleave', endDrag);
}

function init() {
  loadNavbar();
  sections.forEach((section) => section.classList.add('animated-section'));
  revealSections();
  initSmoothScroll();
  initCubeInteraction();
  setActiveLink();

  window.addEventListener('scroll', () => {
    revealSections();
    setActiveLink();
  });
}

window.addEventListener('DOMContentLoaded', init);
