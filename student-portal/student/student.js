// NSHS Student Portal — Shared JS

const PORTAL = {
  init() {
    if (!API.isLoggedIn()) { window.location.href = '../../pages/portal.html'; return; }
    this.renderUser();
    this.initSidebar();
  },

  renderUser() {
    const student = API.getStudent();
    if (!student) return;
    const initial = (student.fullName || 'S')[0].toUpperCase();
    document.getElementById('userInitial') && (document.getElementById('userInitial').textContent = initial);
    document.getElementById('userName')    && (document.getElementById('userName').textContent = student.fullName || 'Student');
    document.getElementById('userNo')      && (document.getElementById('userNo').textContent = student.studentNumber || '—');
  },

  initSidebar() {
    const toggle  = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    toggle?.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); });
    overlay?.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
  }
};

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    API.clearAuth();
    window.location.href = '../../pages/portal.html';
  }
}

function showToast(msg, type='success') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>t.remove(), 4000);
}
