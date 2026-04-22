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

function listarEmpresasProcuradas() {
    var nomeEmpresaVar = nome.value;

    fetch(`/adminFutour/listarEmpresasProcuradas?nome=${nomeEmpresaVar}`)
        .then(function (resposta) {

            console.log("resposta:", resposta);

            if (resposta.status == 204) {
                alert("Nenhum resultado encontrado!");
                return;
            }

            if (resposta.ok) {
                return resposta.json();
            }

            throw new Error("Erro: " + resposta.status);
        })
        .then(function (dados) {
            console.log("Dados:", dados);
        })
        .catch(function (erro) {
            console.log("#ERRO:", erro);
        });

    return false;
}