// --- SISTEMA DE AUTENTICAÇÃO E NAVEGAÇÃO ---

// Variáveis de estado partilhadas (guardadas no LocalStorage do browser)
let usersDB = JSON.parse(localStorage.getItem('vh_fitness_users')) || {};
let currentUser = JSON.parse(localStorage.getItem('vh_fitness_logged_in')) || null;

// Alternar entre ecrãs
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Notificações visuais curtas
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderColor = isSuccess ? 'var(--accent)' : 'var(--danger)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Submissão do Registo
document.getElementById('form-register').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    if (password.length < 6) {
        if (typeof playSound === 'function') playSound('error');
        showToast("A palavra-passe deve ter pelo menos 6 caracteres.", false);
        return;
    }

    if (usersDB[email]) {
        if (typeof playSound === 'function') playSound('error');
        showToast("Este email já está registado.", false);
        return;
    }

    usersDB[email] = {
        name: name,
        email: email,
        password: password,
        points: 0,
        streak: 1,
        lastCheckin: null
    };

    localStorage.setItem('vh_fitness_users', JSON.stringify(usersDB));
    showToast("Conta criada! Faz login.", true);
    this.reset();
    switchScreen('screen-login');
});

// Submissão do Login
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const user = usersDB[email];

    if (user && user.password === password) {
        currentUser = user;
        localStorage.setItem('vh_fitness_logged_in', JSON.stringify(currentUser));
        showToast(`Bem-vindo, ${user.name}!`, true);
        switchScreen('screen-dashboard');
        if (typeof loadDashboard === 'function') loadDashboard();
    } else {
        if (typeof playSound === 'function') playSound('error');
        showToast("Credenciais incorretas.", false);
    }
});

// Botão de Sair
document.getElementById('btn-logout').addEventListener('click', function() {
    currentUser = null;
    localStorage.removeItem('vh_fitness_logged_in');
    switchScreen('screen-login');
    showToast("Sessão terminada.", true);
});

// Alternadores de ecrã manuais
document.getElementById('to-register').addEventListener('click', () => switchScreen('screen-register'));
document.getElementById('to-login').addEventListener('click', () => switchScreen('screen-login'));

// Se já estiver logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        switchScreen('screen-dashboard');
        if (typeof loadDashboard === 'function') loadDashboard();
    }
});


// CONTROLO DE NAVEGAÇÃO ENTRE INÍCIO E BENEFÍCIOS
const btnNavInicio = document.getElementById('nav-inicio');
const btnNavBeneficios = document.getElementById('nav-beneficios');
const viewTabInicio = document.getElementById('tab-inicio');
const viewTabBeneficios = document.getElementById('tab-beneficios');

if (btnNavInicio && btnNavBeneficios) {
    btnNavInicio.addEventListener('click', (e) => {
        e.preventDefault();
        btnNavInicio.classList.add('active');
        btnNavBeneficios.classList.remove('active');
        viewTabInicio.style.display = 'block';
        viewTabBeneficios.style.display = 'none';
    });

    btnNavBeneficios.addEventListener('click', (e) => {
        e.preventDefault();
        btnNavBeneficios.classList.add('active');
        btnNavInicio.classList.remove('active');
        viewTabInicio.style.display = 'none';
        viewTabBeneficios.style.display = 'block';
    });
}