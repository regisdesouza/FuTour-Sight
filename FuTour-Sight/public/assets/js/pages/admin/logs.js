// ================================================
// logs.js
// ================================================
// HTML necessário (adicionar antes do </body>):
//
// <!-- Toast de notificação -->
// <div id="toast" class="toast hidden">
//   <span id="toastMensagem"></span>
// </div>
// ================================================

function buscarLogs() {
    fetch("/adminFutour/logs", { method: "GET" })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((logs) => {
        console.log("Logs recebidos:", logs);

        const ul_logs = document.getElementById("lista-logs");
        ul_logs.innerHTML = "";

        if (!logs || logs.length === 0) {
            ul_logs.innerHTML = "<li>Nenhum log encontrado.</li>";
            return;
        }

        const formatador = new Intl.DateTimeFormat("pt-BR", {
            day:    "2-digit",
            month:  "2-digit",
            year:   "numeric",
            hour:   "2-digit",
            minute: "2-digit",
            hour12: false
        });

        logs.forEach(log => {
            const data = new Date(log.data_criacao);
            const dataFormatada = formatador.format(data);

            ul_logs.innerHTML += `
                <li class="log">
                    <p class="data-hora">${dataFormatada}</p>
                    <p class="mensagem">${log.mensagem}</p>
                    <div class="status">
                        <p class="${log.sucesso ? "sucesso" : "erro"}">${log.sucesso ? "Sucesso" : "Erro"}</p>
                    </div>
                </li>
            `;
        });
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        // mostrarToast("Erro ao carregar logs.", "erro");
        exibirToast("erro", "Erro ao carregar logs");
    });
}

function carregarConfiguracoes() {
    fetch("/adminFutour/notificacoes", { method: "GET" })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((configs) => {
        const container = document.getElementById("lista-configuracoes");
        container.innerHTML = "";

        configs.forEach((config) => {
            const destinatarios = typeof config.destinatarios === "string"
                ? JSON.parse(config.destinatarios)
                : config.destinatarios;

            const destinatariosHtml = destinatarios.map((d) => `
                <div class="destinatario-item">
                    <span>${d.nome} — ${d.email}</span>
                    <label class="toggle">
                        <input
                            type="checkbox"
                            ${d.receber ? "checked" : ""}
                            onchange="atualizarDestinatario(${d.id_usuario}, ${config.id_configuracao_notificacao}, this.checked)"
                        >
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            `).join("");

            container.innerHTML += `
                <div class="config-card">
                    <div class="config-card-header">
                        <span>${config.nome}</span>
                        <label class="toggle">
                            <input
                                type="checkbox"
                                ${config.ativo ? "checked" : ""}
                                onchange="atualizarConfiguracao(${config.id_configuracao_notificacao}, this.checked, ${config.intervalo_minutos})"
                            >
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="config-intervalo">
                        <span>Notificar a cada</span>
                        <input
                            type="number"
                            min="1"
                            id="intervalo-${config.id_configuracao_notificacao}"
                            value="${config.intervalo_minutos}"
                        >
                        <span>minutos</span>
                        <button onclick="salvarIntervalo(${config.id_configuracao_notificacao}, ${config.ativo})">
                            Salvar
                        </button>
                    </div>

                    <div class="config-destinatarios">
                        <p>Destinatários</p>
                        ${destinatariosHtml}
                    </div>
                </div>
            `;
        });
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao carregar configurações");
    });
}

function atualizarConfiguracao(id, ativo, intervalo) {
    fetch(`/adminFutour/notificacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo, intervalo })
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => exibirToast("sucesso", "Configuração atualizada"))
    .catch(() => exibirToast("erro", "Erro ao atualizar configuração"));
}

function salvarIntervalo(id, ativo) {
    const intervalo = parseInt(document.getElementById(`intervalo-${id}`).value);

    if (!intervalo || intervalo < 1) {
        exibirToast("erro", "Intervalo inválido");
        return;
    }

    atualizarConfiguracao(id, ativo, intervalo);
}

function atualizarDestinatario(idUsuario, idConfiguracao, receber) {
    fetch("/adminFutour/notificacoes/destinatario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, idConfiguracao, receber })
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => exibirToast("sucesso", "Destinatário atualizado"))
    .catch(() => exibirToast("erro", "Erro ao atualizar destinatário"));
}

carregarConfiguracoes();

buscarLogs();