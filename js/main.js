/* Sticky header scroll effect */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* Mobile nav toggle */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Before/After Slider */
document.querySelectorAll('.ba-slider').forEach(slider => {
  const handle = slider.querySelector('.ba-handle');
  const before = slider.querySelector('.ba-before');
  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    handle.style.left = pct + '%';
    before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }

  slider.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); });
  window.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  slider.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
});

/* FAQ Accordion */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* Contact Form → Worker */
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    fetch('https://lead-manager-api.irontigerdigital.workers.dev/ingest', {
      method: 'POST',
      body: new FormData(form)
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) window.location.href = '/thank-you/';
        else { btn.textContent = 'Error — Try Again'; btn.disabled = false; }
      })
      .catch(() => { btn.textContent = orig; btn.disabled = false; });
  });
}
