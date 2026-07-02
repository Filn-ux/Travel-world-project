document.addEventListener('DOMContentLoaded', () => {
    // --- SINKRONISASI DATA UNTUK FILE:// PROTOCOL ---
    // Jika browser mengisolasi localStorage per file, kita passing lewat URL dari register ke login
    const params = new URLSearchParams(window.location.search);
    if (params.has('reg_email')) {
        const usersStr = localStorage.getItem('pesonaUsers');
        const users = usersStr ? JSON.parse(usersStr) : [];
        const newEmail = params.get('reg_email');
        // Jangan tambahkan ganda jika di-refresh
        if (!users.find(u => u.email === newEmail)) {
            users.push({
                name: params.get('reg_name'),
                email: newEmail,
                password: params.get('reg_password')
            });
            localStorage.setItem('pesonaUsers', JSON.stringify(users));
        }
        // Bersihkan URL agar rapi
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // --- LOGIKA LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (email.trim() === '' || password.trim() === '') {
                alert('Silakan isi email dan password Anda.');
                return;
            }
            if (!email.endsWith('@gmail.com')) {
                alert('Email harus menggunakan @gmail.com');
                return;
            }

            const usersStr = localStorage.getItem('pesonaUsers');
            const users = usersStr ? JSON.parse(usersStr) : [];
            const user = users.find(u => u.email === email);

            if (!user) {
                alert('Email tidak terdaftar pada Pesona Nusantara. Silakan daftar terlebih dahulu.');
                return;
            }
            if (user.password !== password) {
                alert('Kata sandi salah. Silakan coba lagi.');
                return;
            }

            alert(`Login berhasil! Selamat datang, ${user.name}`);
            window.location.href = 'index.html';
        });
    }

    // --- LOGIKA REGISTER FORM ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
                alert('Silakan isi semua data Anda.');
                return;
            }
            if (!email.endsWith('@gmail.com')) {
                alert('Pendaftaran gagal: Email harus menggunakan @gmail.com');
                return;
            }

            const usersStr = localStorage.getItem('pesonaUsers');
            const users = usersStr ? JSON.parse(usersStr) : [];
            if (users.find(u => u.email === email)) {
                alert('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung login.');
                return;
            }

            // Simpan lokal di halaman register
            users.push({ name, email, password });
            localStorage.setItem('pesonaUsers', JSON.stringify(users));

            alert(`Pendaftaran berhasil untuk akun ${email}! Silakan login.`);

            // Redirect ke login.html sambil membawa data untuk sinkronisasi (bypass isolasi file://)
            window.location.href = `login.html?reg_email=${encodeURIComponent(email)}&reg_name=${encodeURIComponent(name)}&reg_password=${encodeURIComponent(password)}`;
        });
    }

    // --- EFEK STICKY NAVBAR ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // --- AUTO-CLOSE MENU MOBILE ---
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

}
);

// --- POPUP DISKON (jQuery) ---
if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        if ($('#discountModal').length > 0) {
            setTimeout(function () {
                try {
                    $('#discountModal').modal('show');
                } catch (e) {
                    // Fallback to vanilla JS if Bootstrap jQuery plugin fails
                    const modalElement = document.getElementById('discountModal');
                    if (modalElement && typeof bootstrap !== 'undefined') {
                        const bsModal = new bootstrap.Modal(modalElement);
                        bsModal.show();
                    }
                }
            }, 1500);
        }
    });
}
