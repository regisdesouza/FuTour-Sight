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
var chkEmail = false;
var chkTelefone = false;
var chkMensagem = false;

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

function onkey_email() {
    var emaill = email.value.trim();
    let erro = "";

    if (emaill == '') {
        erro = `Preencha o campo E-mail de Contato`;
    } else if (emaill.indexOf("@") == -1) {
        erro = `Insira um email válido que contenha @`;
    }

    if (erro != "") {
        div_msg_email.innerHTML = `${erro}`;
        chkEmail = false;
    } else {
        div_msg_email.innerHTML = ``;
        chkEmail = true;
    }
}

function onkey_telefone() {
    var telefonee = telefone.value.trim();
    let erro = "";

    if (telefonee == '') {
        erro = `Preencha o campo Telefone de Contato`
    } else if (telefonee.length != 11) {
        erro = `Informe um número válido igual ao exemplo`;
    }

    if (erro != "") {
        div_msg_telefone.innerHTML = `${erro}`
        chkTelefone = false;
    } else {
        div_msg_telefone.innerHTML = ``;
        chkTelefone = true;
    }
}

function onkey_mensagem() {
    var mensagemm = mensagem.value.trim();
    let erro = "";

    if (mensagemm == '') {
        erro = `Preencha o campo Mensagem`
    } else if (mensagemm.length < 10) {
        erro = `Mensagem muito curta`;
    } else if (mensagemm.length > 1000) {
        erro = `Mensagem muito longa`;
    }

    if (erro != "") {
        div_msg_msg.innerHTML = `${erro}`
        chkMensagem = false;
    } else {
        div_msg_msg.innerHTML = ``;
        chkMensagem = true;
    }
}

function enviarMensagem() {
    onkey_nome();
    onkey_email();
    onkey_telefone();
    onkey_mensagem();

    const temErro = chkNome &&
        chkEmail &&
        chkTelefone &&
        chkMensagem

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos.";
        finalizarAguardar();
        return false;
    } else {
        setInterval(sumirMensagem, 3000);
        var nomeVar = nome.value;
        var emailVar = email.value;
        var telefoneVar = telefone.value;
        var mensagemVar = mensagem.value;

        fetch("/usuarios/enviarMensagem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeServer: nomeVar,
                emailServer: emailVar,
                telefoneServer: telefoneVar,
                mensagemServer: mensagemVar
            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    div_msg.innerHTML =
                        "Mensagem enviada com sucesso! Agradecemos o contato!";
                    nome.value = "";
                    email.value = "";
                    telefone.value = "";
                    mensagem.value = "";
                    setTimeout(() => {
                        div_msg.innerHTML = "";
                    }, "5000");
                } else {
                    throw "Houve um erro ao tentar enviar a mensagem!";
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

