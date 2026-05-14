// ================================================
// editarFuncionario.js
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
// <div id="div_msg_nome"       class="msg-erro"></div>
// <div id="div_msg_email"      class="msg-erro"></div>
// <div id="div_msg_permissao"  class="msg-erro"></div>
// ================================================

preencherNomeUsuario();

var chkNome      = false;
var chkEmail     = false;
var chkPermissao = false;

var idUsuario = sessionStorage.getItem("ID_USUARIO_EDITAR");

if (!idUsuario) {
    // mostrarToast("Nenhum funcionário selecionado.", "erro");
    ativarToast("erro", "Nenhum funcionário selecionado");
    // setTimeout(() => {
        window.location.href = "../usuario/lista-funcionarios.html";
    // }, 2000);
}

function onkey_nome() {
    var erro = validarNome(document.getElementById("nome-funcionario").value.trim());

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

function onkey_permissao() {
    var erro = validarPermissao(document.getElementById("nivel-permissao").value);

    if (erro != "") {
        document.getElementById("div_msg_permissao").innerHTML = erro;
        chkPermissao = false;
    } else {
        document.getElementById("div_msg_permissao").innerHTML = "";
        chkPermissao = true;
    }
}

function buscarFuncionario() {
    fetch(`/usuariosAdmin/funcionarios/${idUsuario}`, {
        method: "GET"
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        document.getElementById("nome-funcionario").value    = dados.nome;
        document.getElementById("email").value               = dados.email;
        document.getElementById("nivel-permissao").value    = dados.fk_nivel_permissao;

        chkNome      = true;
        chkEmail     = true;
        chkPermissao = true;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao carregar dados do funcionário.");
    });
}

function salvarEdicao() {
    onkey_nome();
    onkey_email();
    onkey_permissao();

    const temErro = chkNome && chkEmail && chkPermissao;

    if (!temErro) {
        exibirToast('erro', 'Preencha todos os campos')
        return;
    }

    var nome      = document.getElementById("nome-funcionario").value.trim();
    var email     = document.getElementById("email").value.trim();
    var permissao = document.getElementById("nivel-permissao").value;

    fetch(`/usuariosAdmin/funcionarios/${idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer:      nome,
            emailServer:     email,
            permissaoServer: permissao
        })
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => {
        ativarToast("sucesso", "Funcionário atualizado com sucesso!");
        // setTimeout(() => {
            sessionStorage.removeItem("ID_USUARIO_EDITAR");
            window.location.href = "../usuario/lista-funcionarios.html";
        // }, 2000);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao atualizar funcionário");
    });
}

function cancelar() {
    sessionStorage.removeItem("ID_USUARIO_EDITAR");
    window.location.href = "../usuario/lista-funcionarios.html";
}

buscarFuncionario();
