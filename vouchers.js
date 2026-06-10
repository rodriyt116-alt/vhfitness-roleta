// Ler o utilizador ligado através do LocalStorage
let currentUser = JSON.parse(localStorage.getItem('vh_fitness_logged_in'));

function carregarPaginaVouchers() {
    const container = document.getElementById('vouchers-full-list');
    if (!container) return;

    // Se não houver utilizador ou se não tiver vouchers
    if (!currentUser || !currentUser.vouchers || currentUser.vouchers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #a3a3a3;">
                <i class="fa-solid fa-ticket-simple" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.3;"></i>
                <p style="font-style: italic; margin: 0;">Ainda não tens nenhum voucher ativo.</p>
                <small style="display: block; margin-top: 8px;">Troca os teus pontos na aba de benefícios!</small>
            </div>
        `;
        return;
    }

    // Gerar o HTML expandido para cada Voucher
    let html = '';
    currentUser.vouchers.forEach((v, index) => {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: rgba(74, 222, 128, 0.02); border: 1px dashed rgba(74, 222, 128, 0.25); border-radius: 12px; transition: 0.2s;">
                <div>
                    <span style="font-weight: 600; font-size: 1.05rem; display: block; margin-bottom: 4px;">${v.item}</span>
                    <small style="color: #a3a3a3; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-clock"></i> Disponível para levantamento
                    </small>
                </div>
                <div style="text-align: right;">
                    <code class="voucher-code" onclick="copiarCodigo('${v.codigo}')" style="color: #4ade80; font-family: monospace; font-weight: 700; font-size: 1rem; background: #121212; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: inline-block; border: 1px solid rgba(74, 222, 128, 0.1);">
                        ${v.codigo} <i class="fa-regular fa-copy" style="font-size: 0.8rem; margin-left: 4px;"></i>
                    </code>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Função utilitária para copiar o código ao clicar
function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        // Se tiveres a função showToast global podes usá-la aqui, senão um alert resolve para teste
        alert("Código " + codigo + " copiado para a área de transferência!");
    });
}

// Inicializar a listagem
document.addEventListener('DOMContentLoaded', carregarPaginaVouchers);