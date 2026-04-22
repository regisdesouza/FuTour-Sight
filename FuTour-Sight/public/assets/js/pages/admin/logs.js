function buscarLogs() {
  fetch("/adminFutour/buscarLogs", {
    method: "GET",
  })
    .then((resposta) => resposta.json())
    .then((logs) => {
      console.log("Logs recebidos:", logs);
    })
    .catch((erro) => {
      console.error("#ERRO:", erro);
    });
}