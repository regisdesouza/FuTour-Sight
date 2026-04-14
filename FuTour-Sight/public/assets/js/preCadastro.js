const ipt_menu_hamburguer = document.getElementById('menu-hamburguer');

const botao_home = document.getElementById('botao-home');
const botao_contato = document.getElementById('botao-contato');

const array_botoes = [botao_home, botao_contato];

array_botoes.forEach(botao => {
    botao.addEventListener('click', () => fecharMenuHamburguer())
});

function fecharMenuHamburguer() {
    ipt_menu_hamburguer.checked = false;
};

var chkNome = false;
var chkEmailPessoal = false;
var chkEmpresa = false;
var chkEmailCorporativo = false;
var chkCnpj = false;
var chkTelefoneCorporativo = false;

function onkey_nome() {
    var nomee = nome.value.trim();
    let erro = "";

    if (nomee == '') {
        erro = `Preencha o campo Nome Completo`;
    }

    if (erro != "") {
        div_msg_nome.innerHTML = `${erro}`;
        chkNome = false;
    } else {
        div_msg_nome.innerHTML = ``;
        chkNome = true;
    }
}

function onkey_email_pessoal() {
    var emaill = emailPessoal.value.trim();
    let erro = "";

    if (emaill == '') {
        erro = `Preencha o campo E-mail de Contato`;
    } else if (emaill.indexOf("@") == -1) {
        erro = `Insira um email válido que contenha @`;
    }

    if (erro != "") {
        div_msg_email_pessoal.innerHTML = `${erro}`;
        chkEmailPessoal = false;
    } else {
        div_msg_email_pessoal.innerHTML = ``;
        chkEmailPessoal = true;
    }
}

function onkey_email_corporativo() {
    var emaill = emailCorporativo.value.trim();
    let erro = "";

    if (emaill == '') {
        erro = `Preencha o campo E-mail de Contato`;
    } else if (emaill.indexOf("@") == -1) {
        erro = `Insira um email válido que contenha @`;
    }

    if (erro != "") {
        div_msg_email_corporativo.innerHTML = `${erro}`;
        chkEmailCorporativo = false;
    } else {
        div_msg_email_corporativo.innerHTML = ``;
        chkEmailCorporativo = true;
    }
}

function onkey_telefone_corporativo() {
    var telefonee = telefone.value.trim();
    let erro = "";

    if (telefonee == '') {
        erro = `Preencha o campo Telefone de Contato`
    } else if (telefonee.length != 11) {
        erro = `Informe um número válido igual ao exemplo`;
    }

    if (erro != "") {
        div_msg_telefone.innerHTML = `${erro}`
        chkTelefoneCorporativo = false;
    } else {
        div_msg_telefone.innerHTML = ``;
        chkTelefoneCorporativo = true;
    }
}

function preCadastrar() {
    onkey_nome();
    onkey_email_pessoal();
    onkey_empresa();
    onkey_email_corporativo();
    onkey_cnpj();
    onkey_telefone_corporativo();

    const temErro = chkNome &&
        chkEmailPessoal &&
        chkEmpresa &&
        chkEmailCorporativo &&
        chkCnpj &&
        chkTelefoneCorporativo

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos.";
        finalizarAguardar();
        return false;
    } else {
        setInterval(sumirMensagem, 3000);
        var nomeVar = nome.value;
        var emailPessoalVar = emailPessoal.value;
        var empresaVar = empresa.value;
        var emailCorporativoVar = emailCorporativo.value;
        var cnpjVar = cnpj.value;
        var telefoneCorporativoVar = telefoneCorporativo.value;

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
                telefoneCorporativoServer: telefoneCorporativoVar
            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    div_msg.innerHTML =
                        "Pré cadastro enviada com sucesso! Agradecemos a confiança!";
                    nome.value = "";
                    emailPessoal.value = "";
                    empresa.value = "";
                    emailCorporativo.value = "";
                    cnpj.value = "";
                    telefoneCorporativo.value = "";
                    setTimeout(() => {
                        div_msg.innerHTML = "";
                    }, "5000");
                } else {
                    throw "Houve um erro ao tentar enviar o pré cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

        return false;
    }
}

function sumirMensagem() {
    cardErro.style.display = "none";
}

