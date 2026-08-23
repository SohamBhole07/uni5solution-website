// uni5solution — shared behaviour
document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Opt in to animated reveal only once JS + IntersectionObserver are confirmed
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    }));
  }

  // Header shrinks + gains shadow after a small scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const setScrolled = () => header.classList.toggle('scrolled', window.scrollY > 12);
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // Button ripple on click — small, disposable, self-removing
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.6;
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Card cursor spotlight — follows pointer, ignored on touch
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  }

  // Animated count-up for stat numbers, triggered once when scrolled into view
  const countTargets = document.querySelectorAll('.stat strong, .hero-stats strong');
  if (countTargets.length) {
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([+-]?[\d,.]+)(.*)$/);
      if (!match) return; // not a countable number (e.g. "24/7") — leave as-is
      const sign = match[1].startsWith('+') ? '+' : '';
      const numeric = parseFloat(match[1].replace(/[+,]/g, ''));
      const suffix = match[2];
      const decimals = (match[1].split('.')[1] || '').length;
      if (isNaN(numeric) || prefersReducedMotion) return;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (numeric * eased).toFixed(decimals);
        el.textContent = sign + Number(current).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = raw; // land exactly on the original text
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      countTargets.forEach(el => countIO.observe(el));
    }
  }

  // Hero network readout — small live-feeling number fluctuation
  if (!prefersReducedMotion) {
    const devicesEl = document.querySelector('#live-devices');
    const latencyEl = document.querySelector('#live-latency');
    if (devicesEl && latencyEl) {
      setInterval(() => {
        devicesEl.textContent = (118 + Math.floor(Math.random() * 18)).toString();
        latencyEl.textContent = (8 + Math.floor(Math.random() * 7)) + 'ms';
      }, 2400);
    }
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Generate heatmap nodes (coverage visualization signature element)
  document.querySelectorAll('.heatmap').forEach(map => {
    const seedBlobs = [
      { top: '18%', left: '22%', size: 140, color: 'rgba(0,201,167,.55)' },
      { top: '48%', left: '62%', size: 170, color: 'rgba(0,201,167,.35)' },
      { top: '72%', left: '30%', size: 120, color: 'rgba(255,138,61,.28)' },
    ];
    seedBlobs.forEach((b, i) => {
      const blob = document.createElement('div');
      blob.className = 'heatmap-blob';
      blob.style.top = b.top; blob.style.left = b.left;
      blob.style.width = b.size + 'px'; blob.style.height = b.size + 'px';
      blob.style.background = b.color;
      blob.style.animationDelay = (i * 1.6) + 's';
      blob.style.animationDuration = (7 + i * 1.5) + 's';
      map.appendChild(blob);
    });

    const aps = [
      { top: '20%', left: '24%' },
      { top: '50%', left: '64%' },
      { top: '74%', left: '32%' },
    ];
    aps.forEach((p, apIndex) => {
      const node = document.createElement('div');
      node.className = 'heatmap-node ap';
      node.style.top = p.top; node.style.left = p.left;
      map.appendChild(node);

      [40, 72].forEach((r, i) => {
        const ring = document.createElement('div');
        ring.className = 'heatmap-ring';
        ring.style.width = r + 'px'; ring.style.height = r + 'px';
        ring.style.top = `calc(${p.top} - ${r/2}px)`;
        ring.style.left = `calc(${p.left} - ${r/2}px)`;
        ring.style.animationDelay = (apIndex * 0.5 + i * 1.4) + 's';
        map.appendChild(ring);
      });
    });
  });

  // Contact form (static demo — see hosting guide for real submission handling)
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.querySelector('#form-note');
      if (note) {
        note.textContent = 'Thanks — this is a design preview. Connect a form backend (see the deployment guide) to receive live enquiries.';
        note.style.color = '#00A889';
      }
      form.reset();
    });
  }

  // Set active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
