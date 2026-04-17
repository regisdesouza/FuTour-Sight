iniciarMenu();

var chkNome = false;
var chkEmailPessoal = false;
var chkEmailCorporativo = false;
var chkTelefoneCorporativo = false;

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

function onkey_telefone_corporativo() {
    var erro = validarTelefone(telefoneCorporativo.value.trim());

    if (erro != "") {
        div_msg_telefone.innerHTML = erro;
        chkTelefoneCorporativo = false;
    } else {
        div_msg_telefone.innerHTML = "";
        chkTelefoneCorporativo = true;
    }
}

function preCadastrar() {
    onkey_nome();
    onkey_email_pessoal();
    onkey_email_corporativo();
    onkey_telefone_corporativo();

    const temErro = chkNome &&
        chkEmailPessoal &&
        chkEmailCorporativo &&
        chkTelefoneCorporativo;

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    var nomeVar = nome.value;
    var emailPessoalVar = emailPessoal.value;
    var empresaVar = empresa.value;
    var emailCorporativoVar = emailCorporativo.value;
    var cnpjVar = cnpj.value;
    var telefoneCorporativoVar = telefoneCorporativo.value;

    fetch("/usuarios/preCadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailPessoalServer: emailPessoalVar,
            empresaServer: empresaVar,
            emailCorporativoServer: emailCorporativoVar,
            cnpjServer: cnpjVar,
            telefoneCorporativoServer: telefoneCorporativoVar
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                div_msg.innerHTML = "Pré cadastro enviado com sucesso!";

                nome.value = "";
                emailPessoal.value = "";
                empresa.value = "";
                emailCorporativo.value = "";
                cnpj.value = "";
                telefoneCorporativo.value = "";

                setTimeout(function () {
                    div_msg.innerHTML = "";
                }, 5000);
            } else {
                throw "Erro no pré cadastro";
            }
        })
        .catch(function (erro) {
            console.log("ERRO:", erro);
        });

    return false;
}