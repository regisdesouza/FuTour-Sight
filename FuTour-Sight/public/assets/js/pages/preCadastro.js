iniciarMenu();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));
Inputmask("99.999.999/9999-99").mask(document.getElementById("cnpj"));

var chkNome = false;
var chkEmailPessoal = false;
var chkNomeEmpresa = false;
var chkEmailCorporativo = false;
var chkCnpj = false;
var chkTelefone = false;

function onkey_nome() {
    var erro = validarNome(nome.value.trim());

    if (erro != "") {
        div_msg_nome.innerHTML = erro;
        chkNome = false;
    } else {
        div_msg_nome.innerHTML = "";
        chkNome = true;
    }
}

function onkey_email_pessoal() {
    var erro = validarEmail(emailPessoal.value.trim());

    if (erro != "") {
        div_msg_email_pessoal.innerHTML = erro;
        chkEmailPessoal = false;
    } else {
        div_msg_email_pessoal.innerHTML = "";
        chkEmailPessoal = true;
    }
}

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
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos corretamente.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    var nomeVar = nome.value;
    var emailPessoalVar = emailPessoal.value;
    var empresaVar = empresa.value;
    var emailCorporativoVar = emailCorporativo.value;
    var cnpjVar = cnpj.value.replace(/\D/g, "");
    var telefoneCorporativoVar = telefone.value.replace(/\D/g, "");

    fetch("/usuarios/preCadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailPessoalServer: emailPessoalVar,
            empresaServer: empresaVar,
            emailCorporativoServer: emailCorporativoVar,
            cnpjServer: cnpjVar,
            telefoneCorporativoServer: telefoneCorporativoVar,
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
        console.log("Pré cadastro realizado:", dados);

        div_msg.innerHTML = "Pré cadastro enviado com sucesso!";

        nome.value = "";
        emailPessoal.value = "";
        empresa.value = "";
        emailCorporativo.value = "";
        cnpj.value = "";
        telefone.value = "";

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