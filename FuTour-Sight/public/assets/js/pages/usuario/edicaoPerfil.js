function editarPerfil() {
    fetch(`/usuarios/editarPerfil/${sessionStorage.getItem("ID_USUARIO")}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
        }),
    })
        .then((resposta) => {
            if (resposta.status == 404) {
                throw new Error("Usuário não encontrado!");
            }

            if (!resposta.ok) {
                throw new Error("Houve um erro ao tentar atualizar os dados pessoais! Código da resposta: " + resposta.status);
            }

            return resposta.json();
        })
        .then((dados) => {
            console.log("Perfil atualizado:", dados);
            window.alert("Dados pessoais atualizados com sucesso pelo usuário de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            window.location = "/dashboard/mural.html";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}