// ================================================
// edicaoEmpresa.js
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
// <div id="div_msg_nome_empresa"      class="msg-erro"></div>
// <div id="div_msg_cnpj"              class="msg-erro"></div>
// <div id="div_msg_email_corporativo" class="msg-erro"></div>
// <div id="div_msg_telefone"          class="msg-erro"></div>
// ================================================

iniciarMenu();
preencherNomeUsuario();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));
Inputmask("99.999.999/9999-99").mask(document.getElementById("cnpj"));
Inputmask("99999-999").mask(document.getElementById("cep"));

var chkNomeEmpresa      = false;
var chkCnpj             = false;
var chkEmailCorporativo = false;
var chkTelefone         = false;

fetch(`/usuariosAdmin/buscarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`)
.then((res) => tratarRespostaFetch(res))
.then((dados) => {
    document.getElementById("empresa").value          = dados.empresa          || "";
    document.getElementById("cnpj").value             = dados.cnpj             || "";
    document.getElementById("emailCorporativo").value = dados.emailCorporativo  || "";
    document.getElementById("telefone").value         = dados.telefoneCorporativo || "";
    document.getElementById("cep").value              = dados.cep              || "";
    document.getElementById("estado").value           = dados.estado           || "";
    document.getElementById("cidade").value           = dados.cidade           || "";
    document.getElementById("bairro").value           = dados.bairro           || "";
    document.getElementById("rua").value              = dados.logradouro       || "";
    document.getElementById("numero").value           = dados.numero           || "";
    document.getElementById("complemento").value      = dados.complemento      || "";

    document.getElementById("banner-nome-empresa").innerHTML  = dados.empresa          || "";
    document.getElementById("banner-email-empresa").innerHTML = dados.emailCorporativo  || "";

    chkNomeEmpresa      = true;
    chkCnpj             = true;
    chkEmailCorporativo = true;
    chkTelefone         = true;
})
.catch((erro) => {
    console.error("#ERRO ao carregar empresa:", erro);
    mostrarToast("Erro ao carregar dados da empresa.", "erro");
});

document.getElementById("cep").addEventListener("blur", () => {
    var cepLimpo = document.getElementById("cep").value.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    .then((res) => res.json())
    .then((dados) => {
        if (dados.erro) {
            mostrarToast("CEP não encontrado.", "erro");
            return;
        }
        document.getElementById("estado").value = dados.uf         || "";
        document.getElementById("cidade").value = dados.localidade || "";
        document.getElementById("bairro").value = dados.bairro     || "";
        document.getElementById("rua").value    = dados.logradouro || "";
        document.getElementById("numero").focus();
    })
    .catch(() => {
        mostrarToast("Erro ao buscar CEP.", "erro");
    });
});

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

function editarEmpresa() {
    onkey_nome_empresa();
    onkey_cnpj();
    onkey_email_corporativo();
    onkey_telefone();

    const temErro = chkNomeEmpresa && chkCnpj && chkEmailCorporativo && chkTelefone;

    if (!temErro) {
        mostrarToast("Preencha todos os campos corretamente.", "erro");
        return false;
    }

    fetch(`/usuariosAdmin/editarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            empresaServer:            document.getElementById("empresa").value.trim(),
            cnpjServer:               document.getElementById("cnpj").value.replace(/\D/g, ""),
            emailCorporativoServer:   document.getElementById("emailCorporativo").value.trim(),
            telefoneCorporativoServer: document.getElementById("telefone").value.replace(/\D/g, ""),
            cepServer:                document.getElementById("cep").value.replace(/\D/g, ""),
            estadoServer:             document.getElementById("estado").value.trim(),
            cidadeServer:             document.getElementById("cidade").value.trim(),
            bairroServer:             document.getElementById("bairro").value.trim(),
            logradouroServer:         document.getElementById("rua").value.trim(),
            numeroServer:             document.getElementById("numero").value.trim(),
            complementoServer:        document.getElementById("complemento").value.trim()
        }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((dados) => {
        console.log("Empresa atualizada:", dados);
        mostrarToast("Dados empresariais atualizados com sucesso!", "sucesso");

        setTimeout(() => {
            window.location.href = "dashboard-proprietario.html";
        }, 2000);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao atualizar empresa.", "erro");
    });

    return false;
}
