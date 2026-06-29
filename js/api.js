// API Configuration - Nebbi School of Health Sciences
const API = {
  BASE_URL: 'http://178.105.190.123:5001/api',

  // Auth
  LOGIN:          '/auth/login',
  STUDENT_LOGIN:  '/auth/student/login',
  FORGOT_PASSWORD:'/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Public
  PROGRAMS:       '/programs',
  NEWS:           '/news',
  EVENTS:         '/events',
  GALLERY:        '/gallery',
  CONTACT:        '/contact',
  VERIFY_CERT:    '/certificates/verify',
  TRACK_APP:      '/admissions/track',

  // Admissions
  APPLY:          '/admissions',

  // Student portal
  STUDENT_ME:         '/students/me',
  STUDENT_RESULTS:    '/students/me/results',
  STUDENT_TIMETABLE:  '/students/me/timetable',
  STUDENT_ID:         '/students/me/id-card',
  STUDENT_ADMISSION:  '/students/me/admission-letter',
  FEES_ME:            '/fees/me',
  FEES_PAY_MTN:       '/fees/pay/mtn',
  FEES_PAY_AIRTEL:    '/fees/pay/airtel',
  FEES_STATUS:        '/fees/pay/status',
  FEES_RECEIPT:       '/fees/receipt',

  // Helper: full URL
  url(path) {
    return this.BASE_URL + path;
  },

  // Helper: authenticated fetch
  async get(path, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(this.url(path), { headers });
    return res.json();
  },

  async post(path, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(this.url(path), {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async postForm(path, formData, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(this.url(path), {
      method: 'POST',
      headers,
      body: formData
    });
    return res.json();
  },

  // Token management
  getToken()  { return localStorage.getItem('nshs_token'); },
  getStudent(){ return JSON.parse(localStorage.getItem('nshs_student') || 'null'); },
  setAuth(token, student) {
    localStorage.setItem('nshs_token', token);
    localStorage.setItem('nshs_student', JSON.stringify(student));
  },
  clearAuth() {
    localStorage.removeItem('nshs_token');
    localStorage.removeItem('nshs_student');
  },
  isLoggedIn() { return !!this.getToken(); }
};
