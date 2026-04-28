function buscarLogs() {
  fetch("/adminFutour/buscarLogs", {
    method: "GET",
  })
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error("Erro na resposta do servidor");
      }
      return resposta.json();
    })
    .then((logs) => {
      console.log("Logs recebidos:", logs);

      const ul_logs = document.getElementById('lista-logs')
      logs.forEach(log => {

        const data = new Date(log.data_criacao);

        const formatador = new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        const dataFormatada = formatador.format(data)

        ul_logs.innerHTML += `
          <li class="log">
            <p class="data-hora">${dataFormatada}</p>
            <p class="mensagem">${log.mensagem}</p>
            <div class="status">
              <p class="${log.sucesso ? "sucesso" : "erro"}">${log.sucesso ? "Sucesso" : "Erro"}</p>
            </div>
          </li>
        `
      });
    })
    .catch((erro) => {
      console.error("#ERRO:", erro);
    });
}

buscarLogs();