// ═══════════════════════════════════════════════════
// NEBBI SCHOOL OF HEALTH SCIENCES — Main JS
// ═══════════════════════════════════════════════════

// ─── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Mobile nav toggle ────────────────────────────
const navToggle  = document.getElementById('navToggle');
const mobileNav  = document.getElementById('mobileNav');

navToggle?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  navToggle.textContent = open ? '✕' : '☰';
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile nav on link click
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.textContent = '☰';
    document.body.style.overflow = '';
  });
});

// ─── Toast notifications ──────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ─── Load Programs from API ───────────────────────
async function loadPrograms() {
  const grid = document.getElementById('programsGrid');
  if (!grid) return;

  try {
    const data = await API.get(API.PROGRAMS + '?limit=6');

    if (!data.success || !data.data.length) {
      grid.innerHTML = getFallbackPrograms();
      return;
    }

    grid.innerHTML = data.data.slice(0, 6).map(p => `
      <div class="program-card" onclick="window.location='pages/programs.html?id=${p.id}'">
        <div class="program-card-header">
          <span class="program-type-badge">${p.type}</span>
          <h3>${p.name}</h3>
        </div>
        <div class="program-card-body">
          <div class="program-meta">
            <div class="program-meta-item"><span>⏱️</span>${p.duration}</div>
            <div class="program-meta-item"><span>📋</span>${p.field}</div>
          </div>
          <p>${p.description ? p.description.substring(0, 100) + '...' : 'A comprehensive health sciences programme preparing you for a rewarding career.'}</p>
        </div>
        <div class="program-card-footer">
          <div class="program-fee">
            From <strong>UGX ${Number(p.fee_per_semester).toLocaleString()}</strong>/sem
          </div>
          <a href="pages/admissions.html" class="btn btn-primary btn-sm">Apply →</a>
        </div>
      </div>
    `).join('');

  } catch (err) {
    // API not reachable — show fallback
    grid.innerHTML = getFallbackPrograms();
  }
}

function getFallbackPrograms() {
  const programs = [
    { name: 'Diploma in Nursing', type: 'diploma', field: 'Nursing', duration: '3 Years', fee: '850,000', icon: '🏥' },
    { name: 'Diploma in Midwifery', type: 'diploma', field: 'Midwifery', duration: '2 Years', fee: '800,000', icon: '👶' },
    { name: 'Clinical Medicine', type: 'diploma', field: 'Medicine', duration: '3 Years', fee: '1,200,000', icon: '⚕️' },
    { name: 'Medical Laboratory', type: 'diploma', field: 'Laboratory', duration: '2 Years', fee: '900,000', icon: '🔬' },
    { name: 'Certificate in Nursing', type: 'certificate', field: 'Nursing', duration: '2 Years', fee: '650,000', icon: '💉' },
    { name: 'Environmental Health', type: 'diploma', field: 'Public Health', duration: '2 Years', fee: '750,000', icon: '🌱' },
  ];

  return programs.map(p => `
    <div class="program-card" onclick="window.location='pages/programs.html'">
      <div class="program-card-header">
        <span class="program-type-badge">${p.type}</span>
        <h3>${p.icon} ${p.name}</h3>
      </div>
      <div class="program-card-body">
        <div class="program-meta">
          <div class="program-meta-item"><span>⏱️</span>${p.duration}</div>
          <div class="program-meta-item"><span>📋</span>${p.field}</div>
        </div>
        <p>A comprehensive programme preparing compassionate and skilled health professionals for communities across Uganda.</p>
      </div>
      <div class="program-card-footer">
        <div class="program-fee">From <strong>UGX ${p.fee}</strong>/sem</div>
        <a href="pages/admissions.html" class="btn btn-primary btn-sm">Apply →</a>
      </div>
    </div>
  `).join('');
}

// ─── Load News from API ───────────────────────────
async function loadNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  try {
    const data = await API.get(API.NEWS + '?limit=3');

    if (!data.success || !data.data.length) {
      grid.innerHTML = getFallbackNews();
      return;
    }

    grid.innerHTML = data.data.map(n => `
      <div class="news-card" onclick="window.location='pages/news.html?id=${n.id}'">
        <div class="news-card-img">
          ${n.image_url
            ? `<img src="${n.image_url}" alt="${n.title}" />`
            : '📰'}
        </div>
        <div class="news-card-body">
          <div class="news-category">${n.category || 'Announcement'}</div>
          <h3>${n.title}</h3>
          <p>${stripHtml(n.body).substring(0, 100)}...</p>
          <div class="news-date">📅 ${formatDate(n.created_at)}</div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    grid.innerHTML = getFallbackNews();
  }
}

function getFallbackNews() {
  const news = [
    { icon: '🎓', cat: 'Admissions', title: '2025/2026 Intake Applications Now Open', body: 'Applications for the 2025/2026 academic year are now open. Interested candidates are encouraged to apply early as spaces are limited.', date: 'June 2025' },
    { icon: '🏆', cat: 'Achievement', title: 'NSHS Students Excel in National Board Exams', body: 'Nebbi School of Health Sciences students have achieved outstanding results in the latest Allied Health Professional Council examinations.', date: 'May 2025' },
    { icon: '🏥', cat: 'Partnership', title: 'New Clinical Partnership with Nebbi General Hospital', body: 'NSHS has strengthened its clinical training partnership with Nebbi General Hospital, providing students with more hands-on experience.', date: 'April 2025' },
  ];

  return news.map(n => `
    <div class="news-card" onclick="window.location='pages/news.html'">
      <div class="news-card-img">${n.icon}</div>
      <div class="news-card-body">
        <div class="news-category">${n.cat}</div>
        <h3>${n.title}</h3>
        <p>${n.body.substring(0, 100)}...</p>
        <div class="news-date">📅 ${n.date}</div>
      </div>
    </div>
  `).join('');
}

// ─── Certificate Verification ─────────────────────
async function verifyCertificate() {
  const input  = document.getElementById('certInput');
  const result = document.getElementById('verifyResult');
  const certNo = input.value.trim();

  if (!certNo) {
    showToast('Please enter a certificate number', 'error');
    return;
  }

  result.style.display = 'block';
  result.className = 'verify-result info';
  result.innerHTML = '<div class="loader"><div class="spinner"></div> Verifying...</div>';

  try {
    const data = await API.get(`${API.VERIFY_CERT}/${certNo}`);

    if (data.success && data.valid) {
      result.className = 'verify-result valid';
      result.innerHTML = `
        <strong>✅ Certificate is GENUINE</strong><br><br>
        <b>Graduate Name:</b> ${data.data.full_name}<br>
        <b>Student Number:</b> ${data.data.student_number}<br>
        <b>Programme:</b> ${data.data.program}<br>
        <b>Issue Date:</b> ${formatDate(data.data.issue_date)}
      `;
    } else {
      result.className = 'verify-result invalid';
      result.innerHTML = '❌ <strong>Certificate not found or invalid.</strong> This certificate number does not exist in our records. If you believe this is an error, contact the registrar.';
    }
  } catch (err) {
    result.className = 'verify-result invalid';
    result.innerHTML = '⚠️ Unable to verify at this time. Please try again or contact the registrar.';
  }
}

// Allow Enter key on certificate input
document.getElementById('certInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') verifyCertificate();
});

// ─── Contact Form ─────────────────────────────────
async function sendContact() {
  const name    = document.getElementById('contactName')?.value.trim();
  const phone   = document.getElementById('contactPhone')?.value.trim();
  const email   = document.getElementById('contactEmail')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !phone || !subject || !message) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const btn = event.target;
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
  } catch (err) {
    // Fallback: open WhatsApp
    const waMsg = encodeURIComponent(`Hello NSHS,\n\nName: ${name}\nPhone: ${phone}\n\n${message}`);
    window.open(`https://wa.me/256772000000?text=${waMsg}`, '_blank');
    showToast('Opening WhatsApp as fallback...', 'info');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
}

// ─── Load stats from API ──────────────────────────
async function loadStats() {
  try {
    const data = await API.get('/reports/dashboard');
    if (data.success) {
      const el = document.getElementById('statStudents');
      if (el && data.data.total_students) {
        el.textContent = data.data.total_students + '+';
      }
    }
  } catch (e) { /* use default */ }
}

// ─── Helpers ──────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-UG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || '';
}

// ─── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadPrograms();
  loadNews();
  loadStats();
});
