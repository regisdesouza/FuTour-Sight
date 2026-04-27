iniciarMenu();

var chkEmail = false;
var chkSenha = false;

function onkey_email() {
    var erro = validarEmail(email.value.trim());

    if (erro != "") {
        div_msg_email.innerHTML = erro;
        chkEmail = false;
    } else {
        div_msg_email.innerHTML = "";
        chkEmail = true;
    }
}

function onkey_senha() {
    var erro = validarSenha(senha.value.trim());

    if (erro != "") {
        div_msg_senha.innerHTML = erro;
        chkSenha = false;
    } else {
        div_msg_senha.innerHTML = "";
        chkSenha = true;
    }
}

function login() {
    var emailVar = email.value;
    var senhaVar = senha.value;

    if (emailVar == "" || senhaVar == "") {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha os campos.";
        setTimeout(sumirMensagem, 3000);
        return false;
    } else {
        sumirMensagem();
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar,
        }),
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro no login. Código da resposta: " + resposta.status);
            }
            return resposta.json();
        })
        .then((json) => {
            console.log("Login realizado:", json);

            sessionStorage.ID_USUARIO = json.id;
            sessionStorage.NOME_USUARIO = json.nome;
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.NIVEL_ACESSO = json.nivel_permissao;
            sessionStorage.ID_EMPRESA = json.fk_empresa;
            sessionStorage.PRIMEIRO_ACESSO = json.primeiro_acesso;
            const nivel = Number(sessionStorage.getItem("NIVEL_ACESSO"));
            const primeiroAcesso = Number(sessionStorage.getItem("PRIMEIRO_ACESSO")) === 1;

            if (nivel === 1) {
                setTimeout(() => {
                    window.location.href = "/admin/solicitacoes.html";
                }, 1000);

            } else if (nivel === 2 && primeiroAcesso) {
                setTimeout(() => {
                    window.location.href = "/usuario/edicao-empresa.html";
                }, 1000);

            } else if (nivel === 2 && !primeiroAcesso) {
                setTimeout(() => {
                    window.location.href = "/usuario/dashboard-proprietario.html";
                }, 1000);

            } else if (nivel === 3 && primeiroAcesso) {
                setTimeout(() => {
                    window.location.href = "/usuario/editar-perfil.html";
                }, 1000);

            } else if (nivel === 3 && !primeiroAcesso) {
                setTimeout(() => {
                    window.location.href = "/usuario/dashboard-gerente.html";
                }, 1000);
            }
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });

    return false;
}