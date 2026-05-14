// ================================================
// preCadastro.js
// ================================================
// HTML necessário (adicionar antes do </body>):
//
// <!-- Toast de notificação -->
// <div id="toast" class="toast hidden">
//   <span id="toastMensagem"></span>
// </div>
//
// Nos campos do formulário, adicionar divs de erro:
// <div id="div_msg_nome"              class="msg-erro"></div>
// <div id="div_msg_email_pessoal"     class="msg-erro"></div>
// <div id="div_msg_nome_empresa"      class="msg-erro"></div>
// <div id="div_msg_email_corporativo" class="msg-erro"></div>
// <div id="div_msg_cnpj"              class="msg-erro"></div>
// <div id="div_msg_telefone"          class="msg-erro"></div>
// ================================================

iniciarMenu();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));
Inputmask("99.999.999/9999-99").mask(document.getElementById("cnpj"));

var chkNome             = false;
var chkEmailPessoal     = false;
var chkNomeEmpresa      = false;
var chkEmailCorporativo = false;
var chkCnpj             = false;
var chkTelefone         = false;

function onkey_nome() {
    var erro = validarNome(document.getElementById("nome").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_nome").innerHTML = erro;
        chkNome = false;
    } else {
        document.getElementById("div_msg_nome").innerHTML = "";
        chkNome = true;
    }
}

function onkey_email_pessoal() {
    var erro = validarEmail(document.getElementById("emailPessoal").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_email_pessoal").innerHTML = erro;
        chkEmailPessoal = false;
    } else {
        document.getElementById("div_msg_email_pessoal").innerHTML = "";
        chkEmailPessoal = true;
    }
}

function onkey_nome_empresa() {
    var erro = validarNomeEmpresa(document.getElementById("empresa").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_nome_empresa").innerHTML = erro;
        chkNomeEmpresa = false;
    } else {
        document.getElementById("div_msg_nome_empresa").innerHTML = "";
        chkNomeEmpresa = true;
    }
}

function onkey_email_corporativo() {
    var erro = validarEmail(document.getElementById("emailCorporativo").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_email_corporativo").innerHTML = erro;
        chkEmailCorporativo = false;
    } else {
        document.getElementById("div_msg_email_corporativo").innerHTML = "";
        chkEmailCorporativo = true;
    }
}

function onkey_cnpj() {
    var erro = validarCnpj(document.getElementById("cnpj").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_cnpj").innerHTML = erro;
        chkCnpj = false;
    } else {
        document.getElementById("div_msg_cnpj").innerHTML = "";
        chkCnpj = true;
    }
}

function onkey_telefone() {
    var erro = validarTelefone(document.getElementById("telefone").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_telefone").innerHTML = erro;
        chkTelefone = false;
    } else {
        document.getElementById("div_msg_telefone").innerHTML = "";
        chkTelefone = true;
    }
}

function preCadastrar() {
    onkey_nome();
    onkey_email_pessoal();
    onkey_nome_empresa();
    onkey_email_corporativo();
    onkey_cnpj();
    onkey_telefone();

    const temErro = chkNome &&
        chkEmailPessoal &&
        chkNomeEmpresa &&
        chkEmailCorporativo &&
        chkCnpj &&
        chkTelefone;

    if (!temErro) {
        exibirToast("erro", "Preencha todos os campos corretamente");
        return false;
    }

    var nomeVar                = document.getElementById("nome").value;
    var emailPessoalVar        = document.getElementById("emailPessoal").value;
    var empresaVar             = document.getElementById("empresa").value;
    var emailCorporativoVar    = document.getElementById("emailCorporativo").value;
    var cnpjVar                = document.getElementById("cnpj").value.replace(/\D/g, "");
    var telefoneCorporativoVar = document.getElementById("telefone").value.replace(/\D/g, "");

    fetch("/usuarios/usuarios/pre-cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer:               nomeVar,
            emailPessoalServer:       emailPessoalVar,
            empresaServer:            empresaVar,
            emailCorporativoServer:   emailCorporativoVar,
            cnpjServer:               cnpjVar,
            telefoneCorporativoServer: telefoneCorporativoVar,
        }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        console.log("Pré cadastro realizado:", dados);
        exibirToast("sucesso", "Pré cadastro enviado com sucesso!");

        limparCampos(["nome", "emailPessoal", "empresa", "emailCorporativo", "cnpj", "telefone"]);

        chkNome             = false;
        chkEmailPessoal     = false;
        chkNomeEmpresa      = false;
        chkEmailCorporativo = false;
        chkCnpj             = false;
        chkTelefone         = false;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao enviar pré cadastro");
    });

    return false;
}