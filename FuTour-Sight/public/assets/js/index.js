iniciarMenu();

Inputmask("(99) 99999-9999").mask(document.getElementById("telefone"));

const textarea = document.getElementById("mensagem");
const contador = document.getElementById("contador_mensagem");

textarea.addEventListener("input", function () {
    const quantidade = textarea.value.length;
    contador.textContent = quantidade + "/1000";
});

var chkNome = false;
var chkEmail = false;
var chkTelefone = false;
var chkMensagem = false;

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

function onkey_email() {
    var erro = validarEmail(email.value.trim());

    if (erro != "") {
        div_msg_email.innerHTML = erro;
        chkEmail = false;
    } else {
        div_msg_email.innerHTML = "";
        chkEmail = true;
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

function onkey_mensagem() {
    var erro = validarMensagem(mensagem.value.trim());

    if (erro != "") {
        div_msg_msg.innerHTML = erro;
        chkMensagem = false;
    } else {
        div_msg_msg.innerHTML = "";
        chkMensagem = true;
    }
}

function enviarMensagem() {
    onkey_nome();
    onkey_email();
    onkey_telefone();
    onkey_mensagem();

    const temErro = chkNome && chkEmail && chkTelefone && chkMensagem;

    if (!temErro) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML = "Preencha todos os campos.";
        setTimeout(sumirMensagem, 3000);
        return false;
    }

    var nomeVar = nome.value;
    var emailVar = email.value;
    var telefoneVar = telefone.value.replace(/\D/g, "");
    var mensagemVar = mensagem.value;

    fetch("/usuarios/enviarMensagem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailServer: emailVar,
            telefoneServer: telefoneVar,
            mensagemServer: mensagemVar
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                div_msg.innerHTML = "Mensagem enviada com sucesso!";
                nome.value = "";
                email.value = "";
                telefone.value = "";
                mensagem.value = "";
                contador.textContent = "0/1000";

                setTimeout(function () {
                    div_msg.innerHTML = "";
                }, 5000);
            } else {
                throw "Erro ao enviar mensagem";
            }
        })
        .catch(function (erro) {
            console.log("ERRO:", erro);
        });

    return false;
}