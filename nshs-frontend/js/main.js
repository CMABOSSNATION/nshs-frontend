// ═══════════════════════════════════════════════════
// NSHS — Main JS (Premium Redesign)
// ═══════════════════════════════════════════════════

// ── Navbar scroll ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.remove('top');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.add('top');
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile nav ────────────────────────────────────
const navToggle  = document.getElementById('navToggle');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

// ── Scroll reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Stat counter animation ────────────────────────
function animateCounter(el, target, suffix = '+') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 24);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const count  = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '+';
      if (count) animateCounter(el, count, suffix);
      else el.textContent = el.dataset.suffix ? el.textContent : el.textContent + '+';
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-num[data-count]').forEach(el => statsObserver.observe(el));

// ── Toast ─────────────────────────────────────────
function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

// ── Load Programmes ───────────────────────────────
async function loadPrograms() {
  const grid = document.getElementById('programsGrid');
  if (!grid) return;
  try {
    const data = await API.get(API.PROGRAMS + '?limit=6');
    if (!data.success || !data.data?.length) { grid.innerHTML = fallbackPrograms(); return; }
    grid.innerHTML = data.data.slice(0, 6).map(p => programCard(p)).join('');
    addReveal(grid);
  } catch { grid.innerHTML = fallbackPrograms(); }
}

function programCard(p) {
  return `
  <div class="program-card reveal" onclick="window.location='pages/programs.html?id=${p.id}'">
    <div class="program-card-top">
      <div class="prog-badge">${p.type}</div>
      <h3>${p.name}</h3>
    </div>
    <div class="program-card-body">
      <div class="prog-meta">
        <div class="prog-meta-item">⏱️ ${p.duration}</div>
        <div class="prog-meta-item">📋 ${p.field}</div>
      </div>
      <p>${p.description ? p.description.substring(0,110) + '...' : 'A comprehensive health sciences programme preparing skilled professionals for Uganda\'s health sector.'}</p>
    </div>
    <div class="program-card-footer">
      <div class="prog-fee">From <strong>UGX ${Number(p.fee_per_semester).toLocaleString()}</strong>/sem</div>
      <a href="pages/admissions.html" class="btn btn-green btn-sm" onclick="event.stopPropagation()">Apply →</a>
    </div>
  </div>`;
}

function fallbackPrograms() {
  const list = [
    { name:'Diploma in Nursing', type:'Diploma', field:'Nursing', duration:'3 Years', fee:'850,000', id:1 },
    { name:'Diploma in Midwifery', type:'Diploma', field:'Midwifery', duration:'2 Years', fee:'800,000', id:2 },
    { name:'Clinical Medicine', type:'Diploma', field:'Medicine', duration:'3 Years', fee:'1,200,000', id:3 },
    { name:'Medical Laboratory', type:'Diploma', field:'Laboratory', duration:'2 Years', fee:'900,000', id:4 },
    { name:'Certificate in Nursing', type:'Certificate', field:'Nursing', duration:'2 Years', fee:'650,000', id:5 },
    { name:'Environmental Health', type:'Diploma', field:'Public Health', duration:'2 Years', fee:'750,000', id:6 },
  ];
  return list.map(p => `
  <div class="program-card reveal" onclick="window.location='pages/programs.html'">
    <div class="program-card-top">
      <div class="prog-badge">${p.type}</div>
      <h3>${p.name}</h3>
    </div>
    <div class="program-card-body">
      <div class="prog-meta">
        <div class="prog-meta-item">⏱️ ${p.duration}</div>
        <div class="prog-meta-item">📋 ${p.field}</div>
      </div>
      <p>A comprehensive programme preparing compassionate and skilled health professionals for communities across Uganda.</p>
    </div>
    <div class="program-card-footer">
      <div class="prog-fee">From <strong>UGX ${p.fee}</strong>/sem</div>
      <a href="pages/admissions.html" class="btn btn-green btn-sm" onclick="event.stopPropagation()">Apply →</a>
    </div>
  </div>`).join('');
}

// ── Load News ─────────────────────────────────────
async function loadNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  try {
    const data = await API.get(API.NEWS + '?limit=3');
    if (!data.success || !data.data?.length) { grid.innerHTML = fallbackNews(); return; }
    grid.innerHTML = data.data.map(n => newsCard(n)).join('');
    addReveal(grid);
  } catch { grid.innerHTML = fallbackNews(); }
}

function newsCard(n) {
  return `
  <div class="news-card reveal" onclick="window.location='pages/news.html?id=${n.id}'" style="cursor:pointer">
    <div class="news-img">
      ${n.image_url ? `<img src="${n.image_url}" alt="${n.title}"/><div class="news-img-overlay"></div>` : '📰'}
    </div>
    <div class="news-body">
      <div class="news-cat">${n.category || 'Announcement'}</div>
      <h3>${n.title}</h3>
      <p>${stripHtml(n.body).substring(0,110)}...</p>
    </div>
    <div class="news-footer">
      <span class="news-date">📅 ${formatDate(n.created_at)}</span>
      <span class="news-read">Read more →</span>
    </div>
  </div>`;
}

function fallbackNews() {
  const list = [
    { icon:'🎓', cat:'Admissions', title:'2025/2026 Intake Applications Now Open', body:'Applications for the 2025/2026 academic year are now open. Interested candidates are encouraged to apply early as spaces are limited across all programmes.', date:'June 2025' },
    { icon:'🏆', cat:'Achievement', title:'NSHS Students Excel in National Board Exams', body:'Nebbi School of Health Sciences students achieved outstanding results in the latest Allied Health Professional Council board examinations across Uganda.', date:'May 2025' },
    { icon:'🏥', cat:'Partnership', title:'New Clinical Training Partnership Signed', body:'NSHS has strengthened its clinical training partnership with Nebbi General Hospital, expanding hands-on training opportunities for all students.', date:'April 2025' },
  ];
  return list.map(n => `
  <div class="news-card reveal" style="cursor:pointer" onclick="window.location='pages/news.html'">
    <div class="news-img">${n.icon}</div>
    <div class="news-body">
      <div class="news-cat">${n.cat}</div>
      <h3>${n.title}</h3>
      <p>${n.body.substring(0,110)}...</p>
    </div>
    <div class="news-footer">
      <span class="news-date">📅 ${n.date}</span>
      <span class="news-read">Read more →</span>
    </div>
  </div>`).join('');
}

// ── Certificate Verify ────────────────────────────
async function verifyCertificate() {
  const input  = document.getElementById('certInput');
  const result = document.getElementById('verifyResult');
  const certNo = input.value.trim();
  if (!certNo) { showToast('Please enter a certificate number', 'error'); return; }

  result.style.display = 'block';
  result.className = 'verify-result info';
  result.innerHTML = '<div class="loader" style="padding:16px"><div class="spinner"></div> Verifying...</div>';

  try {
    const data = await API.get(`${API.VERIFY_CERT}/${certNo}`);
    if (data.success && data.valid) {
      result.className = 'verify-result valid';
      result.innerHTML = `
        ✅ <strong>Certificate is GENUINE</strong><br><br>
        <b>Graduate:</b> ${data.data.full_name}<br>
        <b>Student No:</b> ${data.data.student_number}<br>
        <b>Programme:</b> ${data.data.program}<br>
        <b>Issued:</b> ${formatDate(data.data.issue_date)}`;
    } else {
      result.className = 'verify-result invalid';
      result.innerHTML = '❌ <strong>Certificate not found or invalid.</strong> This number does not exist in our records. Contact the registrar if you believe this is an error.';
    }
  } catch {
    result.className = 'verify-result invalid';
    result.innerHTML = '⚠️ Unable to verify at this time. Please try again or contact the registrar office.';
  }
}

document.getElementById('certInput')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') verifyCertificate();
});

// ── Contact Form ──────────────────────────────────
async function sendContact() {
  const name    = document.getElementById('contactName')?.value.trim();
  const phone   = document.getElementById('contactPhone')?.value.trim();
  const email   = document.getElementById('contactEmail')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !phone || !subject || !message) {
    showToast('Please fill all required fields', 'error'); return;
  }

  const btn = event.currentTarget || document.querySelector('[onclick="sendContact()"]');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const data = await API.post(API.CONTACT, { name, phone, email, subject, message });
    if (data.success) {
      showToast('Message sent! We will get back to you shortly.', 'success');
      ['contactName','contactPhone','contactEmail','contactSubject','contactMessage']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    } else {
      showToast(data.message || 'Failed to send. Please try again.', 'error');
    }
  } catch {
    const waMsg = encodeURIComponent(`Hello NSHS,\n\nName: ${name}\nPhone: ${phone}\n\n${message}`);
    window.open(`https://wa.me/256772000000?text=${waMsg}`, '_blank');
    showToast('Opening WhatsApp as backup...', 'info');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// ── Helpers ───────────────────────────────────────
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-UG', { day:'numeric', month:'long', year:'numeric' });
}
function stripHtml(html) {
  const t = document.createElement('div');
  t.innerHTML = html || '';
  return t.textContent || '';
}
function addReveal(parent) {
  parent.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadPrograms();
  loadNews();
});
