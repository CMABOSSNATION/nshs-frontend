// ═══════════════════════════════════════════════════
// NSHS ADMIN — Core JS
// ═══════════════════════════════════════════════════

const ADMIN = {
  BASE_URL: 'http://178.105.190.123:5001/api',

  // ── Auth ──
  getToken()  { return localStorage.getItem('nshs_admin_token'); },
  getUser()   { return JSON.parse(localStorage.getItem('nshs_admin_user') || 'null'); },
  setAuth(token, user) {
    localStorage.setItem('nshs_admin_token', token);
    localStorage.setItem('nshs_admin_user', JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem('nshs_admin_token');
    localStorage.removeItem('nshs_admin_user');
  },
  isLoggedIn() { return !!this.getToken(); },

  // ── Redirect if not logged in ──
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '../index.html';
    }
  },

  // ── HTTP helpers ──
  async get(path) {
    const res = await fetch(this.BASE_URL + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(this.BASE_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async put(path, body) {
    const res = await fetch(this.BASE_URL + path, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async postForm(path, formData) {
    const res = await fetch(this.BASE_URL + path, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });
    return res.json();
  },

  async delete(path) {
    const res = await fetch(this.BASE_URL + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
    return res.json();
  },

  // ── Toast notifications ──
  toast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => t.style.opacity = '0', 3500);
    setTimeout(() => t.remove(), 4000);
  },

  // ── Format helpers ──
  formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  formatDateTime(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-UG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  formatMoney(n) {
    return 'UGX ' + Number(n || 0).toLocaleString();
  },
  stripHtml(html) {
    const t = document.createElement('div');
    t.innerHTML = html || '';
    return t.textContent || '';
  },

  // ── Status badge ──
  statusBadge(status) {
    const map = {
      pending:      'badge-pending',
      under_review: 'badge-pending',
      approved:     'badge-approved',
      rejected:     'badge-rejected',
      active:       'badge-active',
      inactive:     'badge-navy',
      completed:    'badge-approved',
      failed:       'badge-rejected',
      published:    'badge-approved',
      draft:        'badge-navy',
    };
    return `<span class="badge ${map[status] || 'badge-navy'}">${status?.replace(/_/g,' ')}</span>`;
  },

  // ── Confirm dialog ──
  confirm(msg) {
    return window.confirm(msg);
  },

  // ── Sidebar active link ──
  setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('data-href');
      if (href && path.includes(href)) {
        item.classList.add('active');
      }
    });
  },

  // ── Sidebar toggle ──
  initSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('sidebarOverlay');

    toggleBtn?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  },

  // ── Render user in topbar & sidebar ──
  renderUser() {
    const user = this.getUser();
    if (!user) return;
    const initial = (user.name || 'A')[0].toUpperCase();
    document.querySelectorAll('.user-name').forEach(el => el.textContent = user.name || 'Admin');
    document.querySelectorAll('.user-role').forEach(el => el.textContent = user.role || 'admin');
    document.querySelectorAll('.user-initial').forEach(el => el.textContent = initial);
  },

  // ── Logout ──
  logout() {
    if (this.confirm('Are you sure you want to logout?')) {
      this.clearAuth();
      window.location.href = '../index.html';
    }
  },

  // ── Pagination ──
  renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container || totalPages <= 1) { if(container) container.innerHTML = ''; return; }

    let html = '';
    html += `<button class="page-btn" onclick="(${onPageChange})(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="(${onPageChange})(${i})">${i}</button>`;
      } else if (Math.abs(i - currentPage) === 2) {
        html += `<span style="padding:0 4px;color:var(--gray-400)">...</span>`;
      }
    }
    html += `<button class="page-btn" onclick="(${onPageChange})(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    container.innerHTML = html;
  },

  // ── Init page ──
  init() {
    this.requireAuth();
    this.renderUser();
    this.initSidebar();
    this.setActiveNav();
  }
};
