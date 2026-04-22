function listarEmpresas() {
    fetch("/adminFutour/listarEmpresas", {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then((empresas) => {
            console.log("Empresas recebidas:", empresas);

            listaEmpresasCadastradas = empresas;

            empresas.forEach((empresa) => {
                console.log("Empresa:", empresa);
                console.log("Nome:", empresa.nome);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}