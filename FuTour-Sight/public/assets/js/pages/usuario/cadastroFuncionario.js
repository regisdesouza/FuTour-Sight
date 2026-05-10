// ================================================
// cadastroFuncionario.js
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
// <div id="div_msg_nome"   class="msg-erro"></div>
// <div id="div_msg_email"  class="msg-erro"></div>
// <div id="div_msg_senha"  class="msg-erro"></div>
// ================================================

iniciarMenu();
preencherNomeUsuario();

var chkNome  = false;
var chkEmail = false;
var chkSenha = false;

function onkey_nome() {
    var erro = validarNome(document.getElementById("nome-colab").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_nome").innerHTML = erro;
        chkNome = false;
    } else {
        document.getElementById("div_msg_nome").innerHTML = "";
        chkNome = true;
    }
}

function onkey_email() {
    var erro = validarEmail(document.getElementById("email-colab").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_email").innerHTML = erro;
        chkEmail = false;
    } else {
        document.getElementById("div_msg_email").innerHTML = "";
        chkEmail = true;
    }
}

function onkey_senha() {
    var erro = validarSenha(document.getElementById("senha-colab").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_senha").innerHTML = erro;
        chkSenha = false;
    } else {
        document.getElementById("div_msg_senha").innerHTML = "";
        chkSenha = true;
    }
}

function cadastrarFuncionario() {
    onkey_nome();
    onkey_email();
    onkey_senha();

    const temErro = chkNome && chkEmail && chkSenha;

    if (!temErro) {
        mostrarToast("Preencha todos os campos corretamente.", "erro");
        return false;
    }

    var nomeVar      = document.getElementById("nome-colab").value;
    var emailVar     = document.getElementById("email-colab").value;
    var senhaVar     = document.getElementById("senha-colab").value;
    var permissaoVar = document.getElementById("nivel").value;
    var idEmpresaVar = sessionStorage.getItem("ID_EMPRESA");

    if (!idEmpresaVar) {
        mostrarToast("Empresa não identificada. Faça login novamente.", "erro");
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
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        console.log("Funcionário cadastrado:", dados);
        mostrarToast("Funcionário cadastrado com sucesso!", "sucesso");

        limparCampos(["nome-colab", "email-colab", "senha-colab"]);
        document.getElementById("nivel").value = "";

        chkNome  = false;
        chkEmail = false;
        chkSenha = false;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao cadastrar funcionário.", "erro");
    });

    return false;
}
