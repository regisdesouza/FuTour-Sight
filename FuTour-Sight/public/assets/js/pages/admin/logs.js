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

buscarLogs();