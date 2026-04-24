function editarEmpresa() {
    fetch(`/usuariosAdmin/editarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            empresaServer: empresaVar,
            cnpjServer: cnpjVar,
            emailCorporativoServer: emailCorporativoVar,
            telefoneCorporativoServer: telefoneCorporativoVar,
            cepServer: cepVar,
            estadoServer: estadoVar,
            cidadeServer: cidadeVar,
            bairroServer: bairroVar,
            logradouroServer: logradouroVar,
            numeroServer: numeroVar,
            complementoServer: complementoVar,
        }),
    })
        .then((resposta) => {
            if (resposta.status == 404) {
                throw new Error("Empresa não encontrada!");
            }

            if (!resposta.ok) {
                throw new Error("Houve um erro ao tentar atualizar os dados empresariais! Código da resposta: " + resposta.status);
            }

            return resposta.json();
        })
        .then((dados) => {
            console.log("Empresa atualizada:", dados);
            window.alert("Dados empresariais atualizados com sucesso pelo usuário de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            window.location = "/dashboard/mural.html";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}