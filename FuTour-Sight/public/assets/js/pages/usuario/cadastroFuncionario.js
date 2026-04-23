function cadastrarFuncionario() {
    fetch("/usuariosAdmin/cadastrarFuncionario/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailPessoalServer: emailPessoalVar,
            senhaServer: senhaVar,
            unidadeServer: unidadeVar,
            permissaoServer: permissaoVar,
        }),
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro no cadastro de funcionário. Código da resposta: " + resposta.status);
            }
            return resposta.json();
        })
        .then((dados) => {
            console.log("Funcionário cadastrado:", dados);
            div_msg.innerHTML = "Cadastro de funcionário enviado com sucesso!";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });

    return false;
}