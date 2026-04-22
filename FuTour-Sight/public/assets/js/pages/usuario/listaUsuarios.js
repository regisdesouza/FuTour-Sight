function listarUsuarios() {
    fetch("/usuariosAdmin/listarUsuarios", {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then((usuarios) => {
            console.log("Funcionários recebidos:", usuarios);

            listaFuncionariosCadastrados = usuarios;

            usuarios.forEach((usuario) => {
                console.log("Funcionário:", usuario);
                console.log("Nome:", usuario.nome);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

function listarEmpresasProcuradas() {
    var idEmpresaVar = sessionStorage.ID_EMPRESA;
    var nomeFuncionarioVar = nome.value;

    fetch(`/adminFutour/listarUsuariosProcurados?idEmpresa=${idEmpresaVar}&nomeFuncionarioServer=${nomeFuncionarioVar}`)
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