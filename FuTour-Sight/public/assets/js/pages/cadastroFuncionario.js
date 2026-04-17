

function cadastrarFuncionario() {
    fetch("/usuarios/cadastrarFuncionario/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailPessoalServer: emailPessoalVar,
            senhaServer: senhaVar,
            unidadeServer: unidadeVar,
            permissaoServer: permissaoVar
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                div_msg.innerHTML = "Cadastro de funcionário enviado com sucesso!";

            } else {
                throw "Erro no cadastro de funcionário";
            }
        })
        .catch(function (erro) {
            console.log("ERRO:", erro);
        });

    return false;
}