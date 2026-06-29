// NSHS Main JS — Navy + Gold Brand

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  navbar.classList.toggle('top', window.scrollY <= 60);
}, { passive: true });

// ── Mobile Nav ──
const navToggle  = document.getElementById('navToggle');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
navToggle?.addEventListener('click', () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; });
mobileClose?.addEventListener('click', () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; }));

// ── Reveal on scroll ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counter animation ──
function countUp(el, target, suffix) {
  let n = 0; const step = Math.ceil(target / 50);
  const t = setInterval(() => {
    n += step; if (n >= target) { n = target; clearInterval(t); }
    el.textContent = n + suffix;
  }, 30);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      if (target) countUp(el, target, '+');
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── Toast ──
function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

// ── Load News ──
async function loadNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  try {
    const data = await API.get(API.NEWS + '?limit=3');
    if (!data.success || !data.data?.length) { grid.innerHTML = fallbackNews(); return; }
    grid.innerHTML = data.data.map(n => `
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
          <span class="news-read">Read More →</span>
        </div>
      </div>`).join('');
    grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } catch { grid.innerHTML = fallbackNews(); }
}

function fallbackNews() {
  const list = [
    { icon:'🎓', cat:'Admissions', title:'2026 Intake Applications Now Open', body:'Admissions for Jan/Jul 2026 intake are now open. Bursary available for 20 students. Apply early — spaces are limited across all programmes.', date:'2025' },
    { icon:'🏆', cat:'Achievement', title:'NSHS Students Excel In Board Exams', body:'Nebbi School of Health Sciences students achieved outstanding results in the latest Allied Health Professional Council board examinations.', date:'2025' },
    { icon:'💻', cat:'Update', title:'Online & Weekend Lectures Now Available', body:'NSHS now offers both weekend and online lecture options for diploma students, making health education more accessible across Uganda.', date:'2025' },
  ];
  return list.map(n => `
    <div class="news-card reveal" onclick="window.location='pages/news.html'" style="cursor:pointer">
      <div class="news-img">${n.icon}</div>
      <div class="news-body">
        <div class="news-cat">${n.cat}</div>
        <h3>${n.title}</h3>
        <p>${n.body.substring(0,110)}...</p>
      </div>
      <div class="news-footer">
        <span class="news-date">📅 ${n.date}</span>
        <span class="news-read">Read More →</span>
      </div>
    </div>`).join('');
}

// ── Certificate Verify ──
async function verifyCertificate() {
  const input = document.getElementById('certInput');
  const result = document.getElementById('verifyResult');
  const certNo = input.value.trim();
  if (!certNo) { showToast('Please enter a certificate number', 'error'); return; }
  result.style.display = 'block';
  result.className = 'verify-result info';
  result.innerHTML = '<div class="loader" style="padding:12px"><div class="spinner"></div> Verifying...</div>';
  try {
    const data = await API.get(`${API.VERIFY_CERT}/${certNo}`);
    if (data.success && data.valid) {
      result.className = 'verify-result valid';
      result.innerHTML = `✅ <strong>Certificate Is GENUINE</strong><br><br>
        <b>Graduate:</b> ${data.data.full_name}<br>
        <b>Student No:</b> ${data.data.student_number}<br>
        <b>Programme:</b> ${data.data.program}<br>
        <b>Issued:</b> ${formatDate(data.data.issue_date)}`;
    } else {
      result.className = 'verify-result invalid';
      result.innerHTML = '❌ <strong>Certificate Not Found Or Invalid.</strong> This number does not exist in our records. Contact the registrar if you believe this is an error.';
    }
  } catch {
    result.className = 'verify-result invalid';
    result.innerHTML = '⚠️ Unable to verify at this time. Please try again or contact the registrar.';
  }
}
document.getElementById('certInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') verifyCertificate(); });

// ── Contact ──
async function sendContact() {
  const name    = document.getElementById('contactName')?.value.trim();
  const phone   = document.getElementById('contactPhone')?.value.trim();
  const email   = document.getElementById('contactEmail')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();
  if (!name || !phone || !subject || !message) { showToast('Please fill all required fields', 'error'); return; }
  const btn = event.currentTarget;
  const orig = btn.textContent; btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const data = await API.post(API.CONTACT, { name, phone, email, subject, message });
    if (data.success) {
      showToast('Message sent! We will get back to you shortly.', 'success');
      ['contactName','contactPhone','contactEmail','contactSubject','contactMessage'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    } else {
      showToast(data.message || 'Failed to send.', 'error');
    }
  } catch {
    const waMsg = encodeURIComponent(`Hello NSHS,\n\nName: ${name}\nPhone: ${phone}\n\n${message}`);
    window.open(`https://wa.me/256768177177?text=${waMsg}`, '_blank');
    showToast('Opening WhatsApp...', 'info');
  } finally { btn.disabled = false; btn.textContent = orig; }
}

// ── Helpers ──
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-UG', { day:'numeric', month:'long', year:'numeric' });
}
function stripHtml(html) { const t = document.createElement('div'); t.innerHTML = html || ''; return t.textContent || ''; }

// ── Init ──
document.addEventListener('DOMContentLoaded', () => { loadNews(); });
