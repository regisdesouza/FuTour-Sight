iniciarMenu();

document.getElementById("nomeUser").innerHTML  = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("nomeUser-sidebar").innerHTML = sessionStorage.getItem("NOME_USUARIO");

var chkNome  = false;
var chkEmail = false;
var chkSenha = false;

function onkey_nome() {
    var erro = validarNome(document.getElementById("nome-colab").value.trim());

    if (erro != "") {
        div_msg_nome.innerHTML = erro;
        chkNome = false;
    } else {
        div_msg_nome.innerHTML = "";
        chkNome = true;
    }
}

function onkey_email() {
    var erro = validarEmail(document.getElementById("email-colab").value.trim());

    if (erro != "") {
        div_msg_email.innerHTML = erro;
        chkEmail = false;
    } else {
        div_msg_email.innerHTML = "";
        chkEmail = true;
    }
}

function onkey_senha() {
    var erro = validarSenha(document.getElementById("senha-colab").value.trim());

    if (erro != "") {
        div_msg_senha.innerHTML = erro;
        chkSenha = false;
    } else {
        div_msg_senha.innerHTML = "";
        chkSenha = true;
    }
}

function cadastrarFuncionario() {
    onkey_nome();
    onkey_email();
    onkey_senha();

    const temErro = chkNome && chkEmail && chkSenha;

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos corretamente.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    var nomeVar      = document.getElementById("nome-colab").value;
    var emailVar     = document.getElementById("email-colab").value;
    var senhaVar     = document.getElementById("senha-colab").value;
    var permissaoVar = document.getElementById("nivel").value;
    var idEmpresaVar = sessionStorage.getItem("ID_EMPRESA");

    if (!idEmpresaVar) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Empresa não identificada. Faça login novamente.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    fetch("/usuariosAdmin/cadastrarFuncionario/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer:         nomeVar,
            emailPessoalServer: emailVar,
            senhaServer:        senhaVar,
            permissaoServer:    permissaoVar,
            idEmpresaServer:    idEmpresaVar
        }),
    })
    .then((resposta) => {
        if (!resposta.ok) {
            return resposta.json().then(err => {
                throw new Error(err.mensagem);
            });
        }
        return resposta.json();
    })
    .then((dados) => {
        console.log("Funcionário cadastrado:", dados);

        div_msg.innerHTML = "Cadastro de funcionário enviado com sucesso!";

        document.getElementById("nome-colab").value  = "";
        document.getElementById("email-colab").value = "";
        document.getElementById("senha-colab").value = "";
        document.getElementById("nivel").value       = "";

        setTimeout(() => {
            div_msg.innerHTML = "";
        }, 8000);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        div_msg.innerHTML = erro.message;
    });

    return false;
}