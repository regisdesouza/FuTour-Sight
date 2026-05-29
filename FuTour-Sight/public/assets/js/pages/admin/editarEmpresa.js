iniciarMenu();

const idEmpresa = sessionStorage.getItem("ID_EMPRESA_EDITAR");

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));
Inputmask("99.999.999/9999-99").mask(document.getElementById("cnpj"));

var chkNome = false;
var chkCnpj = false;
var chkEmail = false;
var chkTelefone = false;

function buscarDadosEmpresa() {
    if (!idEmpresa) {
        exibirToast("erro", "Empresa não encontrada");
        return;
    }

    fetch(`/adminFutour/empresas/${idEmpresa}`)
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((empresa) => {
            document.getElementById("nome-empresa").value = empresa.nome || "";
            document.getElementById("cnpj").value = empresa.cnpj || "";
            document.getElementById("email").value = empresa.email || "";
            document.getElementById("telefone").value = empresa.telefone || "";
            document.getElementById("nivel").value = empresa.nivel || "";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao buscar dados da empresa");
        });
}

function onkey_nome() {
    var erro = validarNomeEmpresa(document.getElementById("nome-empresa").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_nome").innerHTML = erro;
        chkNome = false;
    } else {
        document.getElementById("div_msg_nome").innerHTML = "";
        chkNome = true;
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

function atualizarEmpresa() {
    onkey_nome();
    onkey_cnpj();
    onkey_email();
    onkey_telefone();

    const temErro = chkNome && chkCnpj && chkEmail && chkTelefone;

    if (!temErro) {
        exibirToast("erro", "Preencha todos os campos corretamente");
        return;
    }

    fetch(`/adminFutour/empresas/${idEmpresa}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: document.getElementById("nome-empresa").value.trim(),
            cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""),
            email: document.getElementById("email").value.trim(),
            telefone: document.getElementById("telefone").value.replace(/\D/g, ""),
            nivel: document.getElementById("nivel").value.trim()
        })
    })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((resultado) => {
            console.log(resultado);
            exibirToast("sucesso", "Empresa atualizada com sucesso!");

            setTimeout(() => {
                window.location.href = "../admin/lista-empresas.html";
            }, 100);
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao atualizar empresa");
        });
}

function cancelar() {
    ativarToast("sucesso", "Edição cancelada com sucesso")

    setTimeout(() => {
        window.location.href = "../admin/lista-empresas.html";
    }, 100);
}

document.getElementById("btn-salvar").addEventListener("click", atualizarEmpresa);

document.getElementById("btn-cancelar").addEventListener("click", cancelar);

buscarDadosEmpresa();