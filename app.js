// ==========================================================================
// 0. CONFIGURAÇÕES INICIAIS E PATCHES TENSORFLOW
// ==========================================================================
if (typeof tf !== 'undefined' && tf.env) {
    tf.env().set('IS_BROWSER', true);
}

if (typeof tf !== 'undefined' && tf.findBackend) {
    if (tf.findBackend('webgl')) {
        tf.setBackend('webgl');
    }
}

// ==========================================================================
// 1. ESTADO GLOBAL E CONFIGURAÇÃO
// ==========================================================================
let usersDB = JSON.parse(localStorage.getItem('vh_fitness_users')) || {};
let currentUser = JSON.parse(localStorage.getItem('vh_fitness_logged_in')) || null;

let rewards = [
    { id: 1, title: 'Acesso à Zona Spa / Sauna', desc: 'Passe livre de 1 dia para relaxar após o treino', cost: 100, icon: 'fa-hot-tub-person' },
    { id: 2, title: 'Reserva de Campo Privado', desc: '1 hora de utilização do estúdio ou campo do ginásio', cost: 300, icon: 'fa-basketball' },
    { id: 3, title: 'Aluguer de Cacifo VIP', desc: 'Cacifo exclusivo com chave durante 1 mês inteiro', cost: 400, icon: 'fa-vault' },
    { id: 4, title: 'Avaliação Física Extra', desc: 'Consulta extra com relatório de bioimpedância', cost: 200, icon: 'fa-heart-pulse' },
    { id: 5, title: 'Treino Acompanhado (30 min)', desc: 'Sessão express focada em técnica com um PT do staff', cost: 350, icon: 'fa-dumbbell' },
    { id: 6, title: 'Plano de Treino Customizado', desc: 'Renovação completa do teu plano de objetivos digitais', cost: 150, icon: 'fa-file-lines' },
    { id: 7, title: 'Passe de 1 Dia para Amigo', desc: 'Trás um convidado para treinar contigo gratuitamente', cost: 80, icon: 'fa-user-plus' },
    { id: 8, title: 'Vaga em Workshop Presencial', desc: 'Inscrição gratuita no próximo evento interno de Nutrição', cost: 120, icon: 'fa-graduation-cap' }
];

const dicasVHFitness = [
    "Mantém-te hidratado! Sabias que podes trocar pontos por benefícios exclusivos?",
    "Foco no plano! Treinar com consistência liberta endorfinas.",
    "Bateu a preguiça? O único treino mau é aquele que não aconteceu.",
    "O teu esforço compensa! Continua a registar os teus treinos diariamente."
];

const coresRoleta = ['#22c55e', '#f97316', '#ef4444']; 

const desafiosPool = [
    { id: 1, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer 15 Agachamentos classics.', tipo: 'squat', meta: 15 },
    { id: 2, dificuldade: 'Médio', pontos: 20, texto: 'Manter Prancha abdominal por 45 segundos.', tipo: 'hold', meta: 45 },
    { id: 3, dificuldade: 'Difícil', pontos: 35, texto: 'Realizar 12 Burpees sem interrupção.', tipo: 'rep', meta: 12 },
    { id: 4, dificuldade: 'Fácil', pontos: 10, texto: 'Executar 30 Saltos de Polichinelo.', tipo: 'rep', meta: 30 },
    { id: 5, dificuldade: 'Médio', pontos: 20, texto: 'Fazer 20 Flexões de braços (joelhos no chão permitidos).', tipo: 'pushup', meta: 20 },
    { id: 6, dificuldade: 'Difícil', pontos: 40, texto: 'Fazer 24 Lunges com salto alternado.', tipo: 'rep', meta: 24 },
    { id: 7, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer Corrida Estática (High Knees) durante 30 segundos.', tipo: 'hold', meta: 30 },
    { id: 8, dificuldade: 'Médio', pontos: 20, texto: 'Manter a posição de Agachamento Isométrico na parede por 45s.', tipo: 'hold', meta: 45 },
    { id: 9, dificuldade: 'Difícil', pontos: 35, texto: 'Executar 20 Abdominais V-Ups.', tipo: 'rep', meta: 20 },
    { id: 10, dificuldade: 'Fácil', pontos: 12, texto: 'Fazer 20 Elevações de calcanhares (gémeos).', tipo: 'rep', meta: 20 },
    { id: 11, dificuldade: 'Médio', pontos: 22, texto: 'Fazer 15 Fundos de tríceps numa cadeira ou banco.', tipo: 'rep', meta: 15 },
    { id: 12, dificuldade: 'Difícil', pontos: 40, texto: 'Fazer 15 Flexões completas com libertação de mãos no chão.', tipo: 'pushup', meta: 15 },
    { id: 13, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer 15 Abdominais Crunch tradicionais.', tipo: 'rep', meta: 15 },
    { id: 14, dificuldade: 'Médio', pontos: 20, texto: 'Executar 20 Mountain Climbers rápidos.', tipo: 'rep', meta: 20 },
    { id: 15, dificuldade: 'Difícil', pontos: 35, texto: 'Fazer 15 Agachamentos com salto vertical (Squat Jumps).', tipo: 'squat', meta: 15 },
    { id: 16, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer 20 Lunges alternados (10 para cada perna).', tipo: 'rep', meta: 20 },
    { id: 17, dificuldade: 'Médio', pontos: 25, texto: 'Manter Prancha Lateral por 30 segundos de cada lado.', tipo: 'hold', meta: 30 },
    { id: 18, dificuldade: 'Difícil', pontos: 45, texto: 'Realizar 10 Burpees seguidos de 10 Flexões.', tipo: 'rep', meta: 10 },
    { id: 19, dificuldade: 'Fácil', pontos: 12, texto: 'Fazer 25 Toques alternados nos calcanhares em decúbito dorsal.', tipo: 'rep', meta: 25 },
    { id: 20, dificuldade: 'Médio', pontos: 20, texto: 'Executar 15 Agachamentos Sumo lentos e controlados.', tipo: 'squat', meta: 15 },
    { id: 21, pointer: 35, dificuldade: 'Difícil', pontos: 35, texto: 'Fazer 40 segundos de Plank Jacks (abrir/fechar pernas em prancha).', tipo: 'hold', meta: 40 },
    { id: 22, dificuldade: 'Fácil', pontos: 10, texto: 'Manter a posição de Ponte de Glúteos por 45 segundos.', tipo: 'hold', meta: 45 },
    { id: 23, dificuldade: 'Médio', pontos: 20, texto: 'Fazer 20 Abdominais de rotação (Russian Twists).', tipo: 'rep', meta: 20 },
    { id: 24, dificuldade: 'Difícil', pontos: 40, texto: 'Fazer 15 Saltar à Corda imaginária em ritmo acelerado (1 minuto).', tipo: 'hold', meta: 60 },
    { id: 25, dificuldade: 'Fácil', pontos: 10, texto: 'Realizar 15 Extensões de lombar no chão (Superman).', tipo: 'rep', meta: 15 },
    { id: 26, dificuldade: 'Médio', pontos: 22, texto: 'Executar 15 Agachamentos com elevação lateral de perna.', tipo: 'squat', meta: 15 },
    { id: 27, dificuldade: 'Difícil', pontos: 35, texto: 'Fazer 12 Flexões em Espada (Pike Push-ups) para ombros.', tipo: 'pushup', meta: 12 },
    { id: 28, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer 20 Passos laterais em agachamento (Monster Walks).', tipo: 'squat', meta: 20 },
    { id: 29, dificuldade: 'Médio', pontos: 25, texto: 'Fazer 45 segundos de Bear Crawl Hold (Prancha do Urso).', tipo: 'hold', meta: 45 },
    { id: 30, dificuldade: 'Difícil', pontos: 45, texto: 'Completar 20 Burpees ao teu ritmo máximo.', tipo: 'rep', meta: 20 },
    { id: 31, dificuldade: 'Fácil', pontos: 12, texto: 'Executar 30 Segundos de socos no ar em posição de agachamento.', tipo: 'hold', meta: 30 },
    { id: 32, dificuldade: 'Médio', pontos: 20, texto: 'Fazer 20 Abdominais Tesoura horizontais.', tipo: 'rep', meta: 20 },
    { id: 33, dificuldade: 'Difícil', pontos: 35, texto: 'Fazer 15 Agachamentos Pistola assistidos (uma perna de cada vez).', tipo: 'squat', meta: 15 },
    { id: 34, dificuldade: 'Fácil', pontos: 10, texto: 'Executar 15 Rotações de braços completas em posição de prancha.', tipo: 'hold', meta: 15 },
    { id: 35, dificuldade: 'Médio', pontos: 20, texto: 'Fazer 20 Lunges reversos alternados.', tipo: 'rep', meta: 20 },
    { id: 36, dificuldade: 'Difícil', pontos: 40, texto: 'Executar 30 Mountain Climbers cruzados (joelho ao cotovelo oposto).', tipo: 'rep', meta: 30 },
    { id: 37, dificuldade: 'Fácil', pontos: 10, texto: 'Fazer 10 Flexões simples focadas na descida lenta (Excêntricas).', tipo: 'pushup', meta: 10 },
    { id: 38, dificuldade: 'Médio', pontos: 25, texto: 'Manter a posição Hollow Body (canoa) por 30 segundos.', tipo: 'hold', meta: 30 },
    { id: 39, dificuldade: 'Difícil', pontos: 50, texto: 'Desafio Supremo: 1 Minuto ininterrompido de Burpees + Prancha.', tipo: 'hold', meta: 60 },
    { id: 40, dificuldade: 'Fácil', pontos: 12, texto: 'Realizar 20 Elevações pélvicas unilaterais (10 de cada lado).', tipo: 'rep', meta: 20 },
    { id: 41, dificuldade: 'Médio', pontos: 20, texto: 'Fazer 20 Agachamentos com salto e toque no chão.', tipo: 'squat', meta: 20 },
    { id: 42, dificuldade: 'Difícil', pontos: 40, texto: 'Fazer 15 Flexões Diamante para tríceps.', tipo: 'pushup', meta: 15 }
];

let streamMedia = null;

// ==========================================================================
// 2. MOTOR DA MEGAROLETA E ANIMAÇÃO DE GIRO
// ==========================================================================
function gerarFatiasMegaroleta() {
    const wheelGroup = document.getElementById('roleta-wheel');
    if (!wheelGroup) return;
    
    wheelGroup.innerHTML = ''; 
    const totalFatias = 42;
    const anguloFatia = 360 / totalFatias;

    for (let i = 0; i < totalFatias; i++) {
        const d1 = i * anguloFatia;
        const d2 = (i + 1) * anguloFatia;
        
        const r = 100; 
        const x1 = 100 + r * Math.cos((Math.PI * d1) / 180);
        const y1 = 100 + r * Math.sin((Math.PI * d1) / 180);
        const x2 = 100 + r * Math.cos((Math.PI * d2) / 180);
        const y2 = 100 + r * Math.sin((Math.PI * d2) / 180);

        const cor = coresRoleta[i % coresRoleta.length];

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M100,100 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`);
        path.setAttribute('fill', cor);
        path.setAttribute('stroke', '#171717');
        path.setAttribute('stroke-width', '0.4');

        const anguloTexto = d1 + (anguloFatia / 2);
        const rx = 100 + 82 * Math.cos((Math.PI * anguloTexto) / 180);
        const ry = 100 + 82 * Math.sin((Math.PI * anguloTexto) / 180);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', rx.toString());
        text.setAttribute('y', (ry + 2).toString());
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '3.5');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('transform', `rotate(${anguloTexto + 90}, ${rx}, ${ry})`);
        text.textContent = (i + 1).toString();

        const grupoFatia = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupoFatia.appendChild(path);
        grupoFatia.appendChild(text);
        wheelGroup.appendChild(grupoFatia);
    }
}

function inicializarModuloRoleta() {
    gerarFatiasMegaroleta();
    verificarEstadoRoletaRealtime();

    const btnGirar = document.getElementById('btn-girar-roleta');
    const wheelGroup = document.getElementById('roleta-wheel');

    if (btnGirar && wheelGroup) {
        const btnClonado = btnGirar.cloneNode(true);
        btnGirar.parentNode.replaceChild(btnClonado, btnGirar);

        btnClonado.addEventListener('click', function() {
            if (!currentUser) return;
            
            const jaGirou = currentUser.ultimoGiroRoleta && new Date(currentUser.ultimoGiroRoleta).toDateString() === new Date().toDateString();
            if (jaGirou) {
                alert("Já giraste a roleta hoje! Conclui o teu desafio ativo ou volta amanhã.");
                return;
            }

            btnClonado.disabled = true;
            btnClonado.textContent = "🎰 A girar a roleta...";

            const indiceSorteado = Math.floor(Math.random() * desafiosPool.length);
            const desafioSorteado = desafiosPool[indiceSorteado];

            const grausPorFatia = 360 / 42;
            const deslocamentoFatia = (indiceSorteado * grausPorFatia) + (grausPorFatia / 2);
            const grausTotaisAlvo = 1800 + (360 - deslocamentoFatia); 

            wheelGroup.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)";
            wheelGroup.style.transformOrigin = "100px 100px";
            wheelGroup.style.transform = `rotate(${grausTotaisAlvo}deg)`;

            setTimeout(() => {
                let corBadge = '#22c55e';
                if (desafioSorteado.dificuldade === 'Médio') corBadge = '#f97316';
                if (desafioSorteado.dificuldade === 'Difícil') corBadge = '#ef4444';

                currentUser.desafioAtivo = {
                    id: desafioSorteado.id,
                    dificuldade: desafioSorteado.dificuldade,
                    pontos: desafioSorteado.pontos,
                    texto: desafioSorteado.texto,
                    tipo: desafioSorteado.tipo,
                    meta: desafioSorteado.meta,
                    cor: corBadge,
                    estado: 'Pendente Submissão'
                };

                currentUser.ultimoGiroRoleta = new Date().toISOString();
                saveUserData();

                exibirDesafioNaUI(currentUser.desafioAtivo);
                verificarEstadoRoletaRealtime();

                alert(`🎯 Sorteado o Desafio Nº ${desafioSorteado.id}: ${desafioSorteado.texto}\nBoa sorte! Prepara a câmara.`);
            }, 4100);
        });
    }
}

function verificarEstadoRoletaRealtime() {
    const btnGirar = document.getElementById('btn-girar-roleta');
    if (!btnGirar) return;

    if (currentUser?.ultimoGiroRoleta && new Date(currentUser.ultimoGiroRoleta).toDateString() === new Date().toDateString()) {
        btnGirar.disabled = true;
        btnGirar.style.opacity = "0.4";
        btnGirar.textContent = "🔒 Roleta Indisponível (Volta Amanhã)";
    } else {
        btnGirar.disabled = false;
        btnGirar.style.opacity = "1";
        btnGirar.textContent = "🎰 Girar Megaroleta de Desafios";
    }
}

function desafioAtivoLocalStorageCheck() {
    if (currentUser?.desafioAtivo && currentUser.desafioAtivo.estado === 'Pendente Submissão') {
        exibirDesafioNaUI(currentUser.desafioAtivo);
    }
}

function exibirDesafioNaUI(desafio) {
    const container = document.getElementById('container-desafio-ativo');
    const badgeDif = document.getElementById('badge-dificuldade');
    const badgePts = document.getElementById('badge-pontos');
    const textoDesafio = document.getElementById('texto-desafio');
    const btnSubmeter = document.getElementById('btn-submeter-desafio');

    if (!container) return;

    const corDificuldade = desafio.cor || '#ef4444';

    if (badgeDif) {
        badgeDif.style.backgroundColor = `${corDificuldade}15`;
        badgeDif.style.color = corDificuldade;
        badgeDif.textContent = `Número ${desafio.id} - ${desafio.dificuldade}`;
    }
    
    if (badgePts) badgePts.textContent = `+${desafio.pontos} PTS`;
    if (textoDesafio) textoDesafio.textContent = desafio.texto;

    if (btnSubmeter) {
        btnSubmeter.disabled = false;
        btnSubmeter.innerHTML = `<i class="fa-solid fa-camera"></i> Ligar Câmara & Iniciar Análise por IA`;
    }

    container.style.width = '100%';
    container.style.boxSizing = 'border-box';
    container.style.display = 'block';
}

function saveUserData() {
    if (!currentUser?.email) return;
    usersDB[currentUser.email] = currentUser;
    localStorage.setItem('vh_fitness_users', JSON.stringify(usersDB));
    localStorage.setItem('vh_fitness_logged_in', JSON.stringify(currentUser));
}

// ==========================================================================
// 3. SISTEMA DE AUTENTICAÇÃO E NAVEGAÇÃO
// ==========================================================================
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
}

function claimReward(title, cost) {
    if (!currentUser || currentUser.points < cost) return;

    currentUser.points -= cost;
    
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 30);

    if (!currentUser.vouchers) currentUser.vouchers = [];
    const novoCodigo = 'VH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    currentUser.vouchers.push({ 
        item: title, 
        codigo: novoCodigo, 
        expira: dataExpiracao.toISOString() 
    });

    saveUserData();

    const mTitle = document.getElementById('modal-reward-title');
    const mVouch = document.getElementById('voucher-display');
    const mModal = document.getElementById('reward-overlay');

    if (mTitle) mTitle.textContent = title;
    if (mVouch) mVouch.textContent = novoCodigo;
    if (mModal) mModal.classList.add('active');
    
    initDashboardSession();
}

function inicializarAutenticacao() {
    document.getElementById('to-register')?.addEventListener('click', () => switchScreen('screen-register'));
    document.getElementById('to-login')?.addEventListener('click', () => switchScreen('screen-login'));

    document.getElementById('form-register')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;

        if (usersDB[email]) {
            alert('Este email já se encontra registado!');
            return;
        }

        usersDB[email] = {
            name: name,
            email: email,
            password: password,
            points: 0,
            streak: 0,
            lastCheckin: null,
            ultimoGiroRoleta: null,
            desafioAtivo: null,
            workouts: [],
            vouchers: []
        };

        localStorage.setItem('vh_fitness_users', JSON.stringify(usersDB));
        alert('Conta criada com sucesso! Já podes efetuar o teu login.');
        this.reset();
        switchScreen('screen-login');
    });

    document.getElementById('form-login')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        const user = usersDB[email];
        if (!user || user.password !== password) {
            alert('Credenciais inválidas! Tenta novamente.');
            return;
        }

        currentUser = user;
        localStorage.setItem('vh_fitness_logged_in', JSON.stringify(currentUser));
        
        this.reset();
        switchScreen('screen-dashboard');
        initDashboardSession();
    });

    document.getElementById('btn-logout')?.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('vh_fitness_logged_in');
        switchScreen('screen-login');
    });
}

// ==========================================================================
// 4. CONTROLO DO PAINEL PRINCIPAL (DASHBOARD)
// ==========================================================================
function initDashboardSession() {
    if (!currentUser) return;

    usersDB = JSON.parse(localStorage.getItem('vh_fitness_users')) || {};
    currentUser = usersDB[currentUser.email] || currentUser;

    const elName = document.getElementById('user-display-name');
    const elPts = document.getElementById('user-points');
    const elStreak = document.getElementById('streak-count');

    if (elName) elName.textContent = currentUser.name;
    if (elPts) elPts.textContent = currentUser.points;
    if (elStreak) elStreak.textContent = currentUser.streak || 0;

    let rank = "Nível Bronze";
    let nextRankLimit = 200;
    let basePoints = 0;

    if (currentUser.points > 500) {
        rank = "⚡ Nível Ouro (Elite)";
        nextRankLimit = currentUser.points;
        basePoints = 500;
    } else if (currentUser.points > 200) {
        rank = "⭐ Nível Prata";
        nextRankLimit = 500;
        basePoints = 200;
    }

    const elRank = document.getElementById('current-rank');
    const elNext = document.getElementById('points-to-next');
    if (elRank) elRank.textContent = rank;
    if (elNext) elNext.textContent = `${currentUser.points} / ${nextRankLimit} pts`;
    
    const percent = nextRankLimit === basePoints ? 100 : ((currentUser.points - basePoints) / (nextRankLimit - basePoints)) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) progressFill.style.width = `${Math.min(percent, 100)}%`;

    const btnCheckin = document.getElementById('btn-checkin');
    if (btnCheckin) {
        const checkedIn = currentUser.lastCheckin && new Date(currentUser.lastCheckin).toDateString() === new Date().toDateString();
        btnCheckin.disabled = checkedIn;
        btnCheckin.innerHTML = checkedIn 
            ? '<i class="fa-solid fa-circle-check"></i> Treino Concluído Hoje!' 
            : '<i class="fa-solid fa-location-dot"></i> Registar Treino <small style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">Ganhar +10 pts</small>';
    }

    renderRewards();
    verificarEstadoRoletaRealtime();
    atualizarHistoricoNaTela();
    desafioAtivoLocalStorageCheck();
}

// ==========================================================================
// 5. MOTOR DE RECOMPENSAS (BENEFÍCIOS)
// ==========================================================================
function renderRewards() {
    const container = document.getElementById('rewards-list');
    if (!container) return;
    container.innerHTML = '';

    Object.assign(container.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        padding: '10px 0'
    });

    rewards.forEach(reward => {
        const canAfford = currentUser.points >= reward.cost;
        const card = document.createElement('div');
        card.className = 'reward-card';
        
        Object.assign(card.style, {
            backgroundColor: '#101010', border: '1px solid #262626', borderRadius: '18px',
            padding: '24px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', alignItems: 'center', textAlign: 'center',
            aspectRatio: '1 / 1', position: 'relative', boxSizing: 'border-box', width: '100%'
        });

        card.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
                <div style="background: rgba(74, 222, 128, 0.08); color: #4ade80; width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                    <i class="fa-solid ${reward.icon}"></i>
                </div>
                <div style="width: 100%;">
                    <h4 style="margin: 0 0 6px 0; color: #ffffff; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${reward.title}</h4>
                    <p style="margin: 0; color: #a3a3a3; font-size: 0.8rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${reward.desc}</p>
                </div>
            </div>
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; border-top: 1px solid #262626; padding-top: 12px; margin-top: auto;">
                <span style="color: #4ade80; font-weight: 700; font-size: 0.95rem;">${reward.cost} pts</span>
                <button class="btn-claim" ${canAfford ? '' : 'disabled'} data-id="${reward.id}" style="
                    width: 100%; background: ${canAfford ? '#4ade80' : '#262626'}; 
                    color: ${canAfford ? '#000000' : '#737373'}; border: none; 
                    padding: 8px 14px; border-radius: 10px; font-weight: 600; 
                    font-size: 0.85rem; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; transition: 0.2s;">
                    ${canAfford ? 'Resgatar' : 'Bloqueado'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('rewards-list')?.addEventListener('click', function(e) {
    const targetButton = e.target.closest('.btn-claim');
    if (!targetButton || targetButton.disabled) return;

    const id = parseInt(targetButton.getAttribute('data-id'));
    const reward = rewards.find(r => r.id === id);
    if (reward) claimReward(reward.title, reward.cost);
});

// ==========================================================================
// 6. CARTEIRA DE VOUCHERS, HISTÓRICO E ABAS
// ==========================================================================
function renderizarCarteiraVouchers() {
    const container = document.getElementById('carteira-vouchers-agrupados');
    if (!container) return;

    if (!currentUser?.vouchers || currentUser.vouchers.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.9rem; padding: 20px 0;">Ainda não tens vouchers ativos.</p>`;
        return;
    }

    let html = '';
    const hoje = new Date();

    currentUser.vouchers.forEach((v) => {
        const expirado = v.expira && new Date(v.expira) < hoje;
        const dataFormatada = v.expira ? new Date(v.expira).toLocaleDateString('pt-PT') : 'N/A';

        html += `
            <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); border-radius: 14px; padding: 16px; opacity: ${expirado ? 0.5 : 1};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 700; color: #ffffff;">${v.item}</span>
                    <small style="color: ${expirado ? '#ef4444' : '#4ade80'}; font-weight: 600;">
                        ${expirado ? 'Expirado' : `Validade: ${dataFormatada}`}
                    </small>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px;">
                    <code style="color: var(--accent); font-family: monospace; font-weight: 700;">${v.codigo}</code>
                    <button class="btn-copy-voucher" data-code="${v.codigo}" ${expirado ? 'disabled' : ''} style="background: none; border: none; color: #a3a3a3; cursor: pointer;">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

document.getElementById('carteira-vouchers-agrupados')?.addEventListener('click', function(e) {
    const copyBtn = e.target.closest('.btn-copy-voucher');
    if (!copyBtn) return;
    const code = copyBtn.getAttribute('data-code');
    navigator.clipboard.writeText(code).then(() => alert(`Código ${code} copiado para a área de transferência!`));
});

function atualizarHistoricoNaTela() {
    const historyContainer = document.getElementById('workout-history-list');
    if (!historyContainer || !currentUser?.workouts) return;

    if (currentUser.workouts.length === 0) {
        historyContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Sem treinos registados.</p>`;
        return;
    }

    historyContainer.innerHTML = currentUser.workouts.slice(-4).reverse().map(workout => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: var(--bg-input, #161616); border-radius: 10px; border-left: 4px solid var(--accent); margin-bottom: 8px;">
            <div>
                <span style="font-weight: 600; font-size: 0.95rem; display: block;">${workout.detalhe || 'Treino Concluído'}</span>
                <small style="color: var(--text-muted);">${workout.data}</small>
            </div>
            <span style="color: var(--accent); font-weight: 700;">+${workout.pontos} PTS</span>
        </div>
    `).join('');
}

function alternarAbasVHFitness(abaAlvo) {
    const dInicio = document.getElementById('tab-inicio');
    const dBeneficios = document.getElementById('tab-beneficios');
    const dRoleta = document.getElementById('tab-roleta');

    if(dInicio) dInicio.style.display = (abaAlvo === 'inicio') ? 'block' : 'none';
    if(dBeneficios) dBeneficios.style.display = (abaAlvo === 'beneficios') ? 'block' : 'none';
    if(dRoleta) dRoleta.style.display = (abaAlvo === 'roleta') ? 'block' : 'none';

    document.getElementById('nav-inicio')?.classList.toggle('active', abaAlvo === 'inicio');
    document.getElementById('nav-beneficios')?.classList.toggle('active', abaAlvo === 'beneficios');
    document.getElementById('nav-roleta')?.classList.toggle('active', abaAlvo === 'roleta');
}

// ==========================================================================
// 7. INICIALIZAÇÃO DO ECOSSISTEMA
// ==========================================================================
function init() {
    inicializarAutenticacao();
    inicializarModuloRoleta();

    document.getElementById('nav-inicio')?.addEventListener('click', (e) => { e.preventDefault(); alternarAbasVHFitness('inicio'); });
    document.getElementById('nav-beneficios')?.addEventListener('click', (e) => { e.preventDefault(); alternarAbasVHFitness('beneficios'); });
    document.getElementById('nav-roleta')?.addEventListener('click', (e) => { e.preventDefault(); alternarAbasVHFitness('roleta'); });
    
    document.getElementById('btn-abrir-carteira')?.addEventListener('click', () => {
        const scrCarteira = document.getElementById('screen-carteira-vouchers');
        if (scrCarteira) scrCarteira.style.display = 'block';
        renderizarCarteiraVouchers();
    });
    
    document.getElementById('btn-voltar-dashboard')?.addEventListener('click', () => {
        const scrCarteira = document.getElementById('screen-carteira-vouchers');
        if (scrCarteira) scrCarteira.style.display = 'none';
    });
    
    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
        document.getElementById('reward-overlay')?.classList.remove('active');
    });

    document.getElementById('btn-checkin')?.addEventListener('click', function() {
        if (!currentUser) return;
        const checkedIn = currentUser.lastCheckin && new Date(currentUser.lastCheckin).toDateString() === new Date().toDateString();
        if (checkedIn) return;

        currentUser.points += 10;
        const today = new Date();

        if (currentUser.lastCheckin) {
            const lastDate = new Date(currentUser.lastCheckin);
            const diffTime = Math.abs(today - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            currentUser.streak = (diffDays === 1) ? (currentUser.streak || 0) + 1 : 1;
        } else {
            currentUser.streak = 1;
        }

        currentUser.lastCheckin = today.toISOString();
        if (!currentUser.workouts) currentUser.workouts = [];
        currentUser.workouts.push({ data: today.toLocaleDateString('pt-PT'), pontos: 10, detail: 'Treino Presencial', detalhe: 'Treino Presencial' });

        saveUserData();
        initDashboardSession();
    });

    if (currentUser) {
        switchScreen('screen-dashboard');
        initDashboardSession();
    } else {
        switchScreen('screen-login');
    }

    const tip = document.getElementById('motivational-tip');
    if (tip) tip.innerText = dicasVHFitness[Math.floor(Math.random() * dicasVHFitness.length)];
}

document.addEventListener('DOMContentLoaded', init);

// ==========================================================================
// 8. PROCESSAMENTO ULTRA-OTIMIZADO DA IA PARA MOBILE & DESKTOP
// ==========================================================================
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        let btnSubmeter = document.getElementById('btn-submeter-desafio');

        if (btnSubmeter) {
            const btnClonado = btnSubmeter.cloneNode(true);
            btnSubmeter.parentNode.replaceChild(btnClonado, btnSubmeter);
            btnSubmeter = btnClonado;

            btnSubmeter.addEventListener('click', async function() {
                let userLogado = JSON.parse(localStorage.getItem('vh_fitness_logged_in'));
                if (!userLogado || !userLogado.desafioAtivo) {
                    alert("Não tens nenhum desafio ativo! Gira a megaroleta primeiro.");
                    return;
                }
                
                const desafio = userLogado.desafioAtivo;
                btnSubmeter.disabled = true;
                btnSubmeter.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> A calibrar detetor...`;

                let videoElement = document.getElementById('ia-video-feed');
                if (!videoElement) {
                    videoElement = document.createElement('video');
                    videoElement.id = 'ia-video-feed';
                    videoElement.setAttribute('playsinline', '');
                    videoElement.setAttribute('webkit-playsinline', '');
                    videoElement.setAttribute('muted', '');
                    Object.assign(videoElement.style, {
                        position: 'fixed', bottom: '10px', right: '10px',
                        width: '140px', height: '105px', zIndex: '9999',
                        border: '2px solid #4ade80', borderRadius: '12px', 
                        transform: 'scaleX(-1)', backgroundColor: '#000000',
                        objectFit: 'cover'
                    });
                    document.body.appendChild(videoElement);
                }

                try {
                    streamMedia = await navigator.mediaDevices.getUserMedia({ 
                        video: { 
                            width: { ideal: 257 }, 
                            height: { ideal: 257 }, 
                            facingMode: "user" 
                        }, 
                        audio: false 
                    });
                    
                    videoElement.srcObject = streamMedia;

                    // ✅ CORREÇÃO CIRÚRGICA: Intercetar metadados para as dimensões nunca virem vazias (Evita Erro NaN)
                    await new Promise((resolve) => {
                        videoElement.onloadedmetadata = () => {
                            videoElement.width = videoElement.videoWidth || 257;
                            videoElement.height = videoElement.videoHeight || 257;
                            resolve();
                        };
                    });
                    
                    await videoElement.play();

                    if (typeof tf !== 'undefined') {
                        await tf.setBackend('webgl');
                        await tf.ready();
                    }

                    let detectorIA;
                    try {
                        // ✅ CORREÇÃO DE VERSÃO: Configurado para o runtime nativo do HTML 'tfjs' compatível com o PoseNet 2.2.2
                        detectorIA = await poseDetection.createDetector(
                            poseDetection.SupportedModels.PoseNet, 
                            { 
                                runtime: 'tfjs',
                                quantBytes: 1, 
                                architecture: 'MobileNetV1', 
                                outputStride: 16, 
                                inputResolution: 257 
                            }
                        );
                    } catch (erroModelo) {
                        console.error("Falha ao instanciar o modelo PoseNet:", erroModelo);
                        alert("O motor de IA falhou ao compilar em segundo plano. Confirma se os scripts CDN estão corretos no teu HTML.");
                        btnSubmeter.disabled = false;
                        btnSubmeter.innerHTML = `<i class="fa-solid fa-camera"></i> Voltar a Tentar`;
                        return;
                    }

                    let contadorReps = 0;
                    let emMovimento = false;
                    let loopAtivoIA = true;
                    let tempoInicioHold = null;

                    console.log("🤖 IA Inicializada com sucesso. A ler exercício:", desafio.texto);

                    async function processarFrame() {
                        if (!loopAtivoIA) return;

                        try {
                            const poses = await detectorIA.estimatePoses(videoElement, {maxPoses: 1, flipHorizontal: false});
                            
                            if (poses && poses.length > 0 && poses[0].keypoints) {
                                const keypoints = poses[0].keypoints;

                                const lShoulder = keypoints.find(k => k.name === 'left_shoulder');
                                const rShoulder = keypoints.find(k => k.name === 'right_shoulder');
                                const ombro = (lShoulder?.score > (rShoulder?.score || 0)) ? lShoulder : rShoulder;

                                const lHip = keypoints.find(k => k.name === 'left_hip');
                                const rHip = keypoints.find(k => k.name === 'right_hip');
                                const anca = (lHip?.score > (rHip?.score || 0)) ? lHip : rHip;

                                const lKnee = keypoints.find(k => k.name === 'left_knee');
                                const rKnee = keypoints.find(k => k.name === 'right_knee');
                                const joelho = (lKnee?.score > (rKnee?.score || 0)) ? lKnee : rKnee;

                                const lElbow = keypoints.find(k => k.name === 'left_elbow');
                                const rElbow = keypoints.find(k => k.name === 'right_elbow'); 
                                const cotovelo = (lElbow?.score > (rElbow?.score || 0)) ? lElbow : rElbow;

                                const textoDesafioLower = desafio.texto.toLowerCase();

                                // 1. Exercícios de Tempo (Hold)
                                if (desafio.tipo === 'hold' || textoDesafioLower.includes('prancha') || textoDesafioLower.includes('manter')) {
                                    if (!tempoInicioHold) tempoInicioHold = Date.now();
                                    contadorReps = Math.floor((Date.now() - tempoInicioHold) / 1000);
                                }
                                
                                // 2. Burpees, Polichinelos e Saltos
                                else if (textoDesafioLower.includes('burpee') || textoDesafioLower.includes('salto') || textoDesafioLower.includes('polichinelo') || desafio.tipo === 'rep') {
                                    if (anca && anca.score > 0.3) {
                                        if (anca.y > 230 && !emMovimento) { 
                                            emMovimento = true; 
                                        } 
                                        if (anca.y < 160 && emMovimento) { 
                                            contadorReps++; 
                                            emMovimento = false; 
                                            console.log("Repetição Contada! Total:", contadorReps);
                                        }
                                    }
                                }
                                
                                // 3. Flexões
                                else if (desafio.tipo === 'pushup' || textoDesafioLower.includes('flex')) {
                                    if (ombro && cotovelo && ombro.score > 0.3 && cotovelo.score > 0.3) {
                                        let distVertical = Math.abs(ombro.y - cotovelo.y);
                                        if (distVertical < 35 && !emMovimento) emMovimento = true;
                                        if (distVertical > 65 && emMovimento) {
                                            contadorReps++;
                                            emMovimento = false;
                                        }
                                    }
                                }
                                
                                // 4. Agachamentos
                                else if (desafio.tipo === 'squat' || textoDesafioLower.includes('agach')) {
                                    if (anca && joelho && anca.score > 0.3 && joelho.score > 0.3) {
                                        if (anca.y >= (joelho.y - 15) && !emMovimento) emMovimento = true;
                                        if (anca.y < (joelho.y - 45) && emMovimento) {
                                            contadorReps++;
                                            emMovimento = false;
                                        }
                                    }
                                }
                            }
                        } catch (err) { 
                            console.error("Erro no processamento do frame de IA:", err); 
                        }

                        if (desafio.tipo === 'hold') {
                            btnSubmeter.innerHTML = `<i class="fa-solid fa-stopwatch fa-spin"></i> Tempo: ${contadorReps}s / ${desafio.meta}s`;
                        } else {
                            btnSubmeter.innerHTML = `<i class="fa-solid fa-running fa-spin"></i> Contagem IA: ${contadorReps} / ${desafio.meta}`;
                        }

                        if (contadorReps >= desafio.meta) {
                            loopAtivoIA = false;
                            if (streamMedia) streamMedia.getTracks().forEach(track => track.stop());
                            videoElement.remove();
                            
                            alert(`🔥 INCRÍVEL! Exercício validado pela IA. Ganhaste +${desafio.pontos} pontos!`);
                            
                            userLogado.points = (parseInt(userLogado.points) || 0) + parseInt(desafio.pontos);
                            if (!userLogado.workouts) userLogado.workouts = [];
                            userLogado.workouts.push({
                                data: new Date().toLocaleDateString('pt-PT'),
                                pontos: desafio.pontos,
                                detalhe: `Desafio Validado por IA: ${desafio.texto}`
                            });
                            
                            userLogado.desafioAtivo = null;
                            localStorage.setItem('vh_fitness_logged_in', JSON.stringify(userLogado));

                            let dbGeral = JSON.parse(localStorage.getItem('vh_fitness_users')) || {};
                            if (dbGeral[userLogado.email]) {
                                dbGeral[userLogado.email].points = userLogado.points;
                                dbGeral[userLogado.email].workouts = userLogado.workouts;
                                dbGeral[userLogado.email].desafioAtivo = null;
                                localStorage.setItem('vh_fitness_users', JSON.stringify(dbGeral));
                            }

                            setTimeout(() => { location.reload(); }, 300);
                        } else {
                            if (loopAtivoIA) window.requestAnimationFrame(processarFrame);
                        }
                    }

                    window.requestAnimationFrame(processarFrame);

                } catch (errCamera) {
                    alert("Erro crítico: A câmara não responde ou o modelo PoseNet falhou ao carregar.");
                    console.error(errCamera);
                    btnSubmeter.disabled = false;
                    btnSubmeter.innerHTML = `<i class="fa-solid fa-camera"></i> Tentar Ligar Câmara Novamente`;
                }
            });
        }
    });
})();
