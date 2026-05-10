// ================================================
// edicaoPerfil.js
// ================================================
// HTML necessário (adicionar antes do </body>):
//
// <!-- Toast de notificação -->
// <div id="toast" class="toast hidden">
//   <span id="toastMensagem"></span>
// </div>
//
// <!-- Modal de confirmação -->
// <div id="modalConfirmacao" class="modal hidden">
//   <div class="modal-content">
//     <h3 id="modalTitulo"></h3>
//     <p id="modalTexto"></p>
//     <div class="modal-botoes">
//       <button id="btnCancelarModal">Cancelar</button>
//       <button id="btnConfirmarModal">Confirmar</button>
//     </div>
//   </div>
// </div>
//
// Nos campos do formulário, adicionar divs de erro:
// <div id="div_msg_nome"  class="msg-erro"></div>
// <div id="div_msg_email" class="msg-erro"></div>
// <div id="div_msg_senha" class="msg-erro"></div>
// ================================================

preencherNomeUsuario();

document.getElementById("banner-nome-usuario").innerHTML  = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("banner-email-usuario").innerHTML = sessionStorage.getItem("EMAIL_USUARIO");

document.getElementById("nome").value  = sessionStorage.getItem("NOME_USUARIO");
document.getElementById("email").value = sessionStorage.getItem("EMAIL_USUARIO");

var chkNome  = false;
var chkEmail = false;
var chkSenha = false;

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

function onkey_senha() {
    var valorSenha = document.getElementById("senha").value.trim();

    // Senha é opcional na edição — só valida se preenchida
    if (valorSenha === "") {
        document.getElementById("div_msg_senha").innerHTML = "";
        chkSenha = true;
        return;
    }

    var erro = validarSenha(valorSenha);

    if (erro != "") {
        document.getElementById("div_msg_senha").innerHTML = erro;
        chkSenha = false;
    } else {
        document.getElementById("div_msg_senha").innerHTML = "";
        chkSenha = true;
    }
}

// Inicializa flags como true porque campos já vêm preenchidos do sessionStorage
chkNome  = true;
chkEmail = true;
chkSenha = true;

function editarPerfil() {
    onkey_nome();
    onkey_email();
    onkey_senha();

    const temErro = chkNome && chkEmail && chkSenha;

    if (!temErro) {
        mostrarToast("Preencha todos os campos corretamente.", "erro");
        return false;
    }

    var nomeVar  = document.getElementById("nome").value.trim();
    var emailVar = document.getElementById("email").value.trim();
    var senhaVar = document.getElementById("senha").value.trim();

    fetch(`/usuarios/editarPerfil/${sessionStorage.getItem("ID_USUARIO")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer:  nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
        }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        console.log("Perfil atualizado:", dados);
        mostrarToast("Dados pessoais atualizados com sucesso!", "sucesso");

        sessionStorage.setItem("NOME_USUARIO",  nomeVar);
        sessionStorage.setItem("EMAIL_USUARIO", emailVar);

        preencherNomeUsuario();
        document.getElementById("banner-nome-usuario").innerHTML  = nomeVar;
        document.getElementById("banner-email-usuario").innerHTML = emailVar;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao atualizar perfil.", "erro");
    });

    return false;
}
