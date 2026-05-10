// ================================================
// index.js
// ================================================
// HTML necessário (adicionar antes do </body>):
//
// <!-- Toast de notificação -->
// <div id="toast" class="toast hidden">
//   <span id="toastMensagem"></span>
// </div>
//
// Nos campos do formulário, adicionar divs de erro:
// <div id="div_msg_nome"      class="msg-erro"></div>
// <div id="div_msg_email"     class="msg-erro"></div>
// <div id="div_msg_telefone"  class="msg-erro"></div>
// <div id="div_msg_msg"       class="msg-erro"></div>
// ================================================

iniciarMenu();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));

const textarea = document.getElementById("mensagem");
const contador  = document.getElementById("contador_mensagem");

textarea.addEventListener("input", function () {
    const quantidade    = textarea.value.length;
    contador.textContent = quantidade + "/1000";
});

var chkNome      = false;
var chkEmail     = false;
var chkTelefone  = false;
var chkMensagem  = false;

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

function onkey_mensagem() {
    var erro = validarMensagem(document.getElementById("mensagem").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_msg").innerHTML = erro;
        chkMensagem = false;
    } else {
        document.getElementById("div_msg_msg").innerHTML = "";
        chkMensagem = true;
    }
}

function enviarMensagem() {
    onkey_nome();
    onkey_email();
    onkey_telefone();
    onkey_mensagem();

    const temErro = chkNome && chkEmail && chkTelefone && chkMensagem;

    if (!temErro) {
        mostrarToast("Preencha todos os campos.", "erro");
        return false;
    }

    var nomeVar      = document.getElementById("nome").value;
    var emailVar     = document.getElementById("email").value;
    var telefoneVar  = document.getElementById("telefone").value.replace(/\D/g, "");
    var mensagemVar  = document.getElementById("mensagem").value;

    fetch("/usuarios/enviarMensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer:     nomeVar,
            emailServer:    emailVar,
            telefoneServer: telefoneVar,
            mensagemServer: mensagemVar,
        }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        console.log("Mensagem enviada:", dados);
        mostrarToast("Mensagem enviada com sucesso!", "sucesso");

        limparCampos(["nome", "email", "telefone", "mensagem"]);
        contador.textContent = "0/1000";

        chkNome     = false;
        chkEmail    = false;
        chkTelefone = false;
        chkMensagem = false;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao enviar mensagem.", "erro");
    });

    return false;
}
