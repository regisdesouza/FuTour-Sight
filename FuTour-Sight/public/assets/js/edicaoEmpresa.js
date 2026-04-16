

function editar() {
    fetch(`/usuarios/editarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
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
            complementoServer: complementoVar
        })
    }).then(function (resposta) {

        if (resposta.ok) {
            window.alert("Dados empresairiais atualizado com sucesso pelo usuario de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            window.location = "/dashboard/mural.html"
        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar atualizar os dados empresariais! Código da resposta: " + resposta.status);
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}