
document.getElementById("nomeUser").innerHTML = sessionStorage.getItem("NOME_USUARIO")

document.getElementById("nomeUser").innerHTML             = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("banner-nome-usuario").innerHTML  = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("banner-email-usuario").innerHTML = sessionStorage.getItem("EMAIL_USUARIO");

document.getElementById("nome").value  = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("email").value = sessionStorage.getItem("EMAIL_USUARIO");

function editarPerfil() {
    let nomeVar = document.getElementById('nome').value;
    let emailVar = document.getElementById('email').value;
    let senhaVar = document.getElementById('nova-senha').value;

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
                exibirToast('erro', "Usuário não encontrado!");
                throw new Error("Usuário não encontrado!");
            }

            if (!resposta.ok) {
                exibirToast('erro', "Houve um erro ao tentar atualizar os dados pessoais! Código da resposta: " + resposta.status);
                throw new Error("Houve um erro ao tentar atualizar os dados pessoais! Código da resposta: " + resposta.status);
            }

            return resposta.json();
        })
        .then((dados) => {
            console.log("Perfil atualizado:", dados);
            exibirToast('sucesso', "Dados pessoais atualizados com sucesso pelo usuário de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            // window.alert("Dados pessoais atualizados com sucesso pelo usuário de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}