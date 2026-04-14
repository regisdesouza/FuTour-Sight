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

var chkEmail = false;
var chkSenha = false;

function onkey_email() {
    var emaill = email.value.trim();
    let erro = "";

    if (emaill == '') {
        erro = `Preencha o campo Email`;
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

function onkey_senha() {
    var senhaa = senha.value.trim();
    let erro = "";

    if (senhaa == '') {
        erro = `Preencha o campo Senha`;
    } else if (senhaa.indexOf("0") == -1 && senhaa.indexOf("1") == -1 && senhaa.indexOf("2") == -1 &&
        senhaa.indexOf("3") == -1 && senhaa.indexOf("4") == -1 && senhaa.indexOf("5") == -1 &&
        senhaa.indexOf("6") == -1 && senhaa.indexOf("7") == -1 && senhaa.indexOf("8") == -1 &&
        senhaa.indexOf("9") == -1) {
        erro = 'A senha deve conter pelo menos um número!';
    }

    if (erro != "") {
        div_msg_senha.innerHTML = `${erro}`;
        chkSenha = false;
    } else {
        div_msg_senha.innerHTML = ``;
        chkSenha = true;
    }
}

function login() {
    aguardar();

    var emailVar = email.value;
    var senhaVar = senha.value;

    if (emailVar == "" || senhaVar == "") {
        cardErro.style.display = "block"
        mensagem_erro.innerHTML = "Preencha os campos para fazer login.";
        finalizarAguardar();
        return false;
    }
    else {
        sumirMensagem();
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));

                sessionStorage.ID_USUARIO = json.id;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NIVEL_ACESSO = json.nivel_permissao;
                sessionStorage.ID_EMPRESA = json.fk_empresa;
                sessionStorage.PRIMEIRO_ACESSO = json.primeiro_acesso;

                console.log('Nivel de acesso')
                console.log(json.nivel_permissao);

                div_erros.innerHTML = '';

                if (sessionStorage.NIVEL_ACESSO == '2' && sessionStorage.PRIMEIRO_ACESSO == '1') {
                    setTimeout(function () {
                        window.location = "";
                    }, 1000);
                } else {
                    setTimeout(function () {
                        window.location = "./dashboardProprietario.html";
                    }, 1000);
                }

                if (sessionStorage.NIVEL_ACESSO == '3' && sessionStorage.PRIMEIRO_ACESSO == '1') {
                    setTimeout(function () {
                        window.location = "";
                    }, 1000);
                } else {
                    setTimeout(function () {
                        window.location = "./dashboardGerente.html";
                    }, 1000);
                }

            });

        } else {

            console.log("Houve um erro ao tentar realizar o login!");

            resposta.text().then(texto => {
                console.error(texto);
                finalizarAguardar(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })
}

function sumirMensagem() {
    cardErro.style.display = "none"
}