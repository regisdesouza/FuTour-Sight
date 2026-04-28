iniciarMenu();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));
Inputmask("99.999.999/9999-99").mask(document.getElementById("cnpj"));
Inputmask("99999-999").mask(document.getElementById("cep"));

var chkNomeEmpresa = false;
var chkCnpj = false;
var chkEmailCorporativo = false;
var chkTelefone = false;

fetch(`/usuariosAdmin/buscarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`)
    .then((res) => res.json())
    .then((dados) => {
        empresa.value = dados.empresa || "";
        cnpj.value = dados.cnpj || "";
        emailCorporativo.value = dados.emailCorporativo || "";
        telefone.value = dados.telefoneCorporativo || "";
        cep.value = dados.cep || "";
        estado.value = dados.estado || "";
        cidade.value = dados.cidade || "";
        bairro.value = dados.bairro || "";
        rua.value = dados.logradouro || "";
        numero.value = dados.numero || "";
        complemento.value = dados.complemento || "";
    })
    .catch((erro) => console.error("#ERRO ao carregar empresa:", erro));

cep.addEventListener("blur", () => {
    var cepLimpo = cep.value.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((res) => res.json())
        .then((dados) => {
            if (dados.erro) return;
            estado.value = dados.uf || "";
            cidade.value = dados.localidade || "";
            bairro.value = dados.bairro || "";
            rua.value = dados.logradouro || "";
            numero.focus();
        });
});


function onkey_nome_empresa() {
    var erro = validarNomeEmpresa(empresa.value.trim());

    if (erro != "") {
        div_msg_nome_empresa.innerHTML = erro;
        chkNomeEmpresa = false;
    } else {
        div_msg_nome_empresa.innerHTML = "";
        chkNomeEmpresa = true;
    }
}

function onkey_cnpj() {
    var erro = validarCnpj(cnpj.value.trim());

    if (erro != "") {
        div_msg_cnpj.innerHTML = erro;
        chkCnpj = false;
    } else {
        div_msg_cnpj.innerHTML = "";
        chkCnpj = true;
    }
}

function onkey_email_corporativo() {
    var erro = validarEmail(emailCorporativo.value.trim());

    if (erro != "") {
        div_msg_email_corporativo.innerHTML = erro;
        chkEmailCorporativo = false;
    } else {
        div_msg_email_corporativo.innerHTML = "";
        chkEmailCorporativo = true;
    }
}

function onkey_telefone() {
    var erro = validarTelefone(telefone.value.trim());

    if (erro != "") {
        div_msg_telefone.innerHTML = erro;
        chkTelefone = false;
    } else {
        div_msg_telefone.innerHTML = "";
        chkTelefone = true;
    }
}

function editarEmpresa() {
    onkey_nome_empresa();
    onkey_email_corporativo();
    onkey_cnpj();
    onkey_telefone();

    const temErro = chkNomeEmpresa &&
        chkCnpj &&
        chkEmailCorporativo &&
        chkTelefone

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos corretamente.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    fetch(`/usuariosAdmin/editarEmpresa/${sessionStorage.getItem("ID_EMPRESA")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            empresaServer: empresa.value.trim(),
            cnpjServer: cnpj.value.replace(/\D/g, ""),
            emailCorporativoServer: emailCorporativo.value.trim(),
            telefoneCorporativoServer: telefone.value.replace(/\D/g, ""),
            cepServer: cep.value.replace(/\D/g, ""),
            estadoServer: estado.value.trim(),
            cidadeServer: cidade.value.trim(),
            bairroServer: bairro.value.trim(),
            logradouroServer: rua.value.trim(),
            numeroServer: numero.value.trim(),
            complementoServer: complemento.value.trim()
        }),
    })
        .then((resposta) => {
            if (resposta.status == 404) throw new Error("Empresa não encontrada!");
            if (!resposta.ok) throw new Error("Houve um erro ao tentar atualizar os dados empresariais! Código: " + resposta.status);
            return resposta.json();
        })
        .then((dados) => {
            console.log("Empresa atualizada:", dados);
            window.alert("Dados empresariais atualizados com sucesso pelo usuário de email: " + sessionStorage.getItem("EMAIL_USUARIO") + "!");
            window.location = "dashboard-proprietario.html";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            alert(erro.message);
        });

    return false;
}