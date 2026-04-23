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
    })
    .catch((erro) => {
      console.error("#ERRO:", erro);
    });
}