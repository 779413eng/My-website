// إدارة الملاحة بين الصفحات
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-btn');
const toast = document.getElementById('toast');

function showView(id) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${id}`).classList.add('active');
  notify(`تم فتح صفحة: ${id}`);
}
navButtons.forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));

function notify(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// إدارة الجلسات (تسجيل الدخول البسيط)
const openLoginBtn = document.getElementById('openLogin');
const logoutBtn = document.getElementById('logout');
const loginModal = document.getElementById('loginModal');
const closeLoginBtn = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const userStatus = document.getElementById('user-status');

function updateSessionUI() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    userStatus.textContent = `مرحباً، ${user.username}`;
    openLoginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    userStatus.textContent = 'غير مسجل';
    openLoginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}
updateSessionUI();

openLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
closeLoginBtn.addEventListener('click', () => loginModal.classList.add('hidden'));

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(loginForm).entries());
  // مثال أكاديمي: قبول أي اسم/كلمة مرور
  localStorage.setItem('user', JSON.stringify({ username: data.username }));
  loginModal.classList.add('hidden');
  updateSessionUI();
  notify('تم تسجيل الدخول');
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  updateSessionUI();
  notify('تم تسجيل الخروج');
});

// الوسائط: رفع صورة وفيديو + تضمين يوتيوب
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  imagePreview.src = url;
  notify('تم تحميل الصورة');
});

const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
videoInput.addEventListener('change', () => {
  const file = videoInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  videoPreview.src = url;
  notify('تم تحميل الفيديو');
});

// تضمين فيديو يوتيوب (تحويل الرابط إلى embed)
const ytUrl = document.getElementById('ytUrl');
const ytFrame = document.getElementById('ytFrame');
document.getElementById('embedYt').addEventListener('click', () => {
  const url = ytUrl.value.trim();
  if (!url) return notify('ضع رابط يوتيوب');
  const videoId = extractYouTubeId(url);
  if (!videoId) return notify('رابط غير صالح');
  ytFrame.src = `https://www.youtube.com/embed/${videoId}`;
  notify('تم تضمين فيديو يوتيوب');
});
function extractYouTubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// الفورمات: حفظ نموذج ملف شخصي محليًا
const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(profileForm).entries());
  localStorage.setItem('profile', JSON.stringify(data));
  notify('تم حفظ الملف الشخصي');
});

// رفع ملف (محلي تجريبي)
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const file = uploadForm.file.files[0];
  if (!file) return notify('اختر ملفاً أولاً');
  // مثال تعليمي: لا يوجد رفع سيرفري هنا، فقط إشعار
  notify(`تم تجهيز الملف "${file.name}" للرفع (مثال تعليمي)`);
});

// الجداول: CRUD بسيط مع تخزين محلي
const tableBody = document.getElementById('tableBody');
const addBtn = document.getElementById('addItem');
const itemName = document.getElementById('itemName');
const itemDesc = document.getElementById('itemDesc');

let items = JSON.parse(localStorage.getItem('items') || '[]');
renderTable();

addBtn.addEventListener('click', () => {
  const name = itemName.value.trim();
  const desc = itemDesc.value.trim();
  if (!name) return notify('أدخل الاسم');
  items.push({ id: Date.now(), name, desc });
  localStorage.setItem('items', JSON.stringify(items));
  itemName.value = ''; itemDesc.value = '';
  renderTable(); notify('تمت الإضافة');
});

function renderTable() {
  tableBody.innerHTML = '';
  items.forEach((it, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${it.name}</td>
      <td>${it.desc}</td>
      <td>
        <button class="secondary" data-id="${it.id}" data-action="edit">تعديل</button>
        <button style="background:var(--danger);color:#250b0b" data-id="${it.id}" data-action="delete">حذف</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

tableBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'delete') {
    items = items.filter(x => x.id !== id);
    localStorage.setItem('items', JSON.stringify(items));
    renderTable(); notify('تم الحذف');
  } else if (action === 'edit') {
    const item = items.find(x => x.id === id);
    const newName = prompt('اسم جديد:', item.name) || item.name;
    const newDesc = prompt('وصف جديد:', item.desc) || item.desc;
    item.name = newName; item.desc = newDesc;
    localStorage.setItem('items', JSON.stringify(items));
    renderTable(); notify('تم التعديل');
  }
});

// تضمين صفحة خارجية
const embedUrlInput = document.getElementById('embedUrl');
const extFrame = document.getElementById('extFrame');
document.getElementById('embedPage').addEventListener('click', () => {
  const url = embedUrlInput.value.trim();
  if (!/^https?:\/\//i.test(url)) return notify('ضع رابط صحيح يبدأ بـ http أو https');
  extFrame.src = url;
  notify('تم تضمين الصفحة (إذا سمح الموقع)');
});

// افتراضي: افتح الصفحة الرئيسية
showView('home');
