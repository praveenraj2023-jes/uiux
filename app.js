/* =============================================
   HostelCare – App Logic
   ============================================= */

// ---- Navigation State ----
let currentPage = 'pageLogin';
const history = [];

function navigateTo(pageId) {
  const prev = document.getElementById(currentPage);
  const next = document.getElementById(pageId);

  if (!next || pageId === currentPage) return;

  // Push to history
  if (pageId !== 'pageLogin' && pageId !== 'pageDashboard') {
    history.push(currentPage);
  } else {
    history.length = 0;
  }

  // Animate out
  prev.classList.add('slide-out');
  setTimeout(() => {
    prev.classList.remove('active', 'slide-out');
  }, 220);

  // Animate in
  next.classList.add('active');
  currentPage = pageId;

  // Scroll back to top
  const scroll = next.querySelector('.page-scroll');
  if (scroll) scroll.scrollTop = 0;
}

// ---- Character Count ----
function updateCharCount() {
  const textarea = document.getElementById('description');
  const counter  = document.getElementById('charCount');
  if (textarea && counter) {
    counter.textContent = `${textarea.value.length} / 300 characters`;
  }
}

// Run on load
window.addEventListener('DOMContentLoaded', () => {
  updateCharCount();
});

// ============================================
// ---- LOGIN LOGIC ----
// ============================================

let selectedRole = 'Student';

// Demo credentials
const DEMO_CREDENTIALS = {
  Student : { id: '21CS1045', password: 'hostel123' },
  Admin   : { id: 'admin',    password: 'admin123'  },
};

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  const tab = role === 'Student'
    ? document.getElementById('roleStudent')
    : document.getElementById('roleAdmin');
  if (tab) tab.classList.add('active');

  // Update placeholder
  const idInput = document.getElementById('loginId');
  if (idInput) {
    idInput.placeholder = role === 'Student'
      ? 'e.g. 21CS1045 or student@uni.edu'
      : 'e.g. admin or admin@uni.edu';
  }
}

function fillDemo() {
  const creds = DEMO_CREDENTIALS[selectedRole];
  const idInput  = document.getElementById('loginId');
  const pwInput  = document.getElementById('loginPassword');
  if (idInput)  idInput.value  = creds.id;
  if (pwInput)  pwInput.value  = creds.password;
  showToast('📋 Demo credentials filled!');
}

function togglePassword() {
  const pwInput  = document.getElementById('loginPassword');
  const eyeIcon  = document.getElementById('eyeIcon');
  if (!pwInput) return;

  if (pwInput.type === 'password') {
    pwInput.type = 'text';
    eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pwInput.type = 'password';
    eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>`;
  }
}

function handleLogin(event) {
  event.preventDefault();

  const idVal  = document.getElementById('loginId').value.trim();
  const pwVal  = document.getElementById('loginPassword').value;
  const btn    = document.getElementById('btnLogin');
  const spinner = document.getElementById('loginSpinner');
  const btnText = btn.querySelector('.btn-text');

  if (!idVal || !pwVal) {
    showToast('⚠️ Please enter your ID and password.');
    shakeField('loginId');
    return;
  }

  // Show loading
  btn.disabled = true;
  btnText.textContent = 'SIGNING IN...';
  spinner.classList.add('active');

  setTimeout(() => {
    const creds = DEMO_CREDENTIALS[selectedRole];
    const valid = (idVal === creds.id || idVal === `${creds.id}@university.edu`) && pwVal === creds.password;

    btn.disabled = false;
    btnText.textContent = 'SIGN IN';
    spinner.classList.remove('active');

    if (valid) {
      showToast(`✅ Welcome back, ${selectedRole}!`);
      setTimeout(() => {
        if (selectedRole === 'Admin') {
          navigateTo('pageAdminDashboard');
          setActiveAdminNav('adminNavHome');
        } else {
          navigateTo('pageDashboard');
          setActiveNav('navHome');
        }
      }, 600);
    } else {
      showToast('❌ Invalid credentials. Try demo credentials.');
      shakeField('loginPassword');
      const pwInput = document.getElementById('loginPassword');
      if (pwInput) { pwInput.value = ''; pwInput.focus(); }
    }
  }, 1500);
}

function shakeField(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}

// ---- Forgot Password ----
function handleForgot(event) {
  event.preventDefault();
  const btn     = document.getElementById('btnForgot');
  const spinner = document.getElementById('forgotSpinner');
  const btnText = btn.querySelector('.btn-text');
  const email   = document.getElementById('forgotEmail').value.trim();

  btn.disabled = true;
  btnText.textContent = 'SENDING...';
  spinner.classList.add('active');

  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'SEND RESET LINK';
    spinner.classList.remove('active');
    showToast(`📧 Reset link sent to ${email}`);
    document.getElementById('forgotEmail').value = '';
    setTimeout(() => navigateTo('pageLogin'), 1500);
  }, 1600);
}

// ============================================
// ---- COMPLAINT SUBMISSION ----
// ============================================
function submitComplaint(event) {
  event.preventDefault();

  const btn     = document.getElementById('btnSubmit');
  const spinner = document.getElementById('btnSpinner');
  const btnText = btn.querySelector('.btn-text');

  const category    = document.getElementById('category').value;
  const block       = document.getElementById('block').value;
  const room        = document.getElementById('room').value;
  const description = document.getElementById('description').value.trim();

  if (!category || !block || !room || !description) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }

  btn.disabled = true;
  btnText.textContent = 'SUBMITTING...';
  spinner.classList.add('active');

  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'SUBMIT COMPLAINT';
    spinner.classList.remove('active');

    const idNum = 12345 + Math.floor(Math.random() * 100);
    const complaintId = `HC-2024-${idNum}`;

    const titles = {
      Plumbing          : 'Leaking washbasin tap',
      Electrical        : 'Electrical issue reported',
      Furniture         : 'Furniture damage reported',
      Housekeeping      : 'Housekeeping issue reported',
      'Internet / Wi-Fi': 'Wi-Fi connectivity issue',
      'AC / Fan'        : 'AC/Fan issue reported',
      Other             : 'General complaint registered',
    };
    const title = titles[category] || 'Complaint registered';

    document.getElementById('complaintIdDisplay').textContent = complaintId;
    document.getElementById('summaryTitle').textContent = title;
    document.getElementById('summaryMeta').textContent  = `${category} • ${block} • ${room}`;
    document.getElementById('summaryDate').textContent  = formatDate();

    navigateTo('pageSubmitted');
    showToast('✅ Complaint submitted successfully!');
  }, 1400);
}

// ---- Fill from Illustrative ----
function fillExample(category, description) {
  const catSelect = document.getElementById('category');
  const descArea  = document.getElementById('description');
  if (catSelect) catSelect.value = category;
  if (descArea) { descArea.value = description; updateCharCount(); }
  showToast('📋 Example filled in form.');
  setTimeout(() => navigateTo('pageRegister'), 700);
}

// ---- Active Nav ----
function setActiveNav(navId) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const target = document.getElementById(navId);
  if (target) target.classList.add('active');
}

// ---- Toast ----
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- Date Formatter ----
function formatDate() {
  const now    = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day    = String(now.getDate()).padStart(2, '0');
  const month  = months[now.getMonth()];
  const year   = now.getFullYear();
  let hours    = now.getHours();
  const mins   = String(now.getMinutes()).padStart(2, '0');
  const ampm   = hours >= 12 ? 'PM' : 'AM';
  hours        = hours % 12 || 12;
  return `${day} ${month} ${year} • ${hours}:${mins} ${ampm}`;
}

// ---- Ripple Effect ----
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-5px); }
      80%    { transform: translateX(5px); }
    }
    .shake { animation: shake 0.45s ease; border-color: #e03131 !important; }
  `;
  document.head.appendChild(style);

  const rippleTargets = ['.quick-card', '.menu-item', '.complaint-card', '.illustrative-item', '.btn-demo'];
  rippleTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top  - size / 2;
        ripple.style.cssText = `
          position:absolute; width:${size}px; height:${size}px;
          left:${x}px; top:${y}px; background:rgba(59,91,219,0.07);
          border-radius:50%; pointer-events:none; transform:scale(0);
          animation:rippleAnim 0.5s ease-out forwards; z-index:0;`;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
      });
    });
  });
});

// ---- Admin Nav ----
function setActiveAdminNav(navId) {
  ['adminNavHome','adminNavComplaints','adminNavProfile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(navId);
  if (target) target.classList.add('active');
}

// ---- Filter Complaints (Admin) ----
function filterComplaints(type) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { all:'filterAll', new:'filterNew', progress:'filterProg', done:'filterDone' };
  const activeTab = document.getElementById(tabMap[type]);
  if (activeTab) activeTab.classList.add('active');

  document.querySelectorAll('.admin-card').forEach(card => {
    const status = card.getAttribute('data-status');
    if (type === 'all') {
      card.style.display = '';
    } else if (type === 'new' && (status === 'new' || status === 'progress')) {
      card.style.display = '';
    } else if (type === 'progress' && status === 'progress') {
      card.style.display = '';
    } else if (type === 'done' && status === 'done') {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ---- Update Complaint Status (Admin Action) ----
function updateStatus(btn, newStatus) {
  const card = btn.closest('.admin-card');
  const badge = card.querySelector('.status-badge');
  const actionsDiv = card.querySelector('.admin-card-actions');

  // Update badge
  badge.className = 'status-badge';
  if (newStatus === 'In Progress') {
    badge.classList.add('status-inprogress');
    badge.textContent = 'In Progress';
    card.setAttribute('data-status', 'progress');
    actionsDiv.innerHTML = `
      <button class="admin-action-tag admin-action-tag--green" onclick="updateStatus(this,'Resolved')">✓ Mark Resolved</button>
      <button class="admin-action-tag admin-action-tag--red" onclick="updateStatus(this,'Rejected')">✕ Reject</button>`;
    showToast('🔧 Complaint marked as In Progress');
  } else if (newStatus === 'Resolved') {
    badge.classList.add('status-resolved');
    badge.textContent = 'Resolved';
    card.setAttribute('data-status', 'done');
    actionsDiv.innerHTML = `<span class="resolved-tag">✓ Resolved on ${formatDate()}</span>`;
    showToast('✅ Complaint marked as Resolved!');
  } else if (newStatus === 'Rejected') {
    badge.classList.add('status-rejected');
    badge.textContent = 'Rejected';
    card.setAttribute('data-status', 'done');
    actionsDiv.innerHTML = `<span class="resolved-tag" style="color:#c92a2a;">✕ Rejected on ${formatDate()}</span>`;
    showToast('❌ Complaint rejected.');
  }
}

// ---- Logout (Student & Admin) ----
function doLogout() {
  showToast('👋 Signed out successfully.');
  setTimeout(() => {
    navigateTo('pageLogin');
    const idInput = document.getElementById('loginId');
    const pwInput = document.getElementById('loginPassword');
    if (idInput) idInput.value = '';
    if (pwInput) pwInput.value = '';
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('btnLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);

  const adminLogoutBtn = document.getElementById('btnAdminLogout');
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', doLogout);
});
