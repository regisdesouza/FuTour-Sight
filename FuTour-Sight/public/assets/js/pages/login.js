iniciarMenu();

var chkEmail = false;

function onkey_email() {
    var erro = validarEmail(document.getElementById("email").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_email").innerHTML = erro;
        chkEmail = false;
    } else {
        document.getElementById("div_msg_email").innerHTML = "";
        chkEmail = true;
    }
}

function login() {
    onkey_email();

    const senhaVar = document.getElementById("senha").value.trim();

    if (!chkEmail || senhaVar === "") {
        exibirToast("erro", "Preencha todos os campos corretamente");
        return false;
    }

    var emailVar = document.getElementById("email").value;

    fetch("/usuarios/usuarios/autenticacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar,
        }),
    })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((json) => {
            console.log("Login realizado:", json);

            if (json.status_usuario !== "ATIVO") {
                exibirToast("erro", "Seu acesso está desativado. Entre em contato com o administrador.");
                return;
            }

            if (json.nivel_permissao !== 1 && json.status_empresa !== "ATIVA") {
                exibirToast("erro", "Sua empresa está inativa ou suspensa. Entre em contato com o suporte.");
                return;
            }

            sessionStorage.setItem("ID_USUARIO", json.id_usuario);
            sessionStorage.setItem("NOME_USUARIO", json.nome);
            sessionStorage.setItem("EMAIL_USUARIO", json.email);
            sessionStorage.setItem("NIVEL_ACESSO", json.nivel_permissao);
            sessionStorage.setItem("ID_EMPRESA", json.empresa);
            sessionStorage.setItem("PRIMEIRO_ACESSO", json.primeiro_acesso);

            const nivel = json.nivel_permissao;
            const primeiroAcesso = json.primeiro_acesso === 1 || json.primeiro_acesso === true;

            if (nivel !== "PLATAFORMA_ADMIN" && json.status_empresa !== "ATIVA") {
                exibirToast("erro", "Sua empresa está inativa ou suspensa. Entre em contato com o suporte.");
                return;
            }

            exibirToast("sucesso", "Login realizado com sucesso!");

            setTimeout(() => {
                if (nivel === "PLATAFORMA_ADMIN") {
                    window.location.href = "/admin/solicitacoes.html";
                } else if (nivel === "EMPRESA_ADMIN" && primeiroAcesso) {
                    window.location.href = "/usuario/edicao-empresa.html";
                } else if (nivel === "EMPRESA_ADMIN" && !primeiroAcesso) {
                    window.location.href = "/usuario/dashboard.html";
                } else if (nivel === "EMPRESA_USER" && primeiroAcesso) {
                    window.location.href = "/usuario/editar-perfil.html";
                } else if (nivel === "EMPRESA_USER" && !primeiroAcesso) {
                    window.location.href = "/usuario/dashboard.html";
                }
            }, 1500);
        })
        .catch(async (erro) => {
            console.error("#ERRO:", erro);

            if (erro.message.includes("Senha incorreta")) {
                exibirToast("erro", "A senha não corresponde à cadastrada.");
            } else if (erro.message.includes("E-mail não encontrado")) {
                exibirToast("erro", "E-mail não encontrado.");
            } else {
                exibirToast("erro", "Erro ao realizar login.");
            }
        });

    return false;
}