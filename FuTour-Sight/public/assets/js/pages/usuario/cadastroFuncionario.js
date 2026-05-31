verificarNivel("EMPRESA_ADMIN");

iniciarMenu();
preencherNomeUsuario();

var chkNome = false;
var chkEmail = false;
var chkSenha = false;

function onkey_nome() {

    var erro = validarNome(
        document.getElementById("nome-colab").value.trim()
    );

    if (erro != "") {

        document.getElementById("div_msg_nome").innerHTML = erro;
        chkNome = false;

    } else {

        document.getElementById("div_msg_nome").innerHTML = "";
        chkNome = true;
    }
}

function onkey_email() {

    var erro = validarEmail(
        document.getElementById("email-colab").value.trim()
    );

    if (erro != "") {

        document.getElementById("div_msg_email").innerHTML = erro;
        chkEmail = false;

    } else {

        document.getElementById("div_msg_email").innerHTML = "";
        chkEmail = true;
    }
}

function onkey_senha() {

    var erro = validarSenha(
        document.getElementById("senha-colab").value.trim()
    );

    if (erro != "") {

        document.getElementById("div_msg_senha").innerHTML = erro;
        chkSenha = false;

    } else {

        document.getElementById("div_msg_senha").innerHTML = "";
        chkSenha = true;
    }
}

async function cadastrarFuncionario() {

    onkey_nome();
    onkey_email();
    onkey_senha();

    const formularioValido =
        chkNome &&
        chkEmail &&
        chkSenha;

    const permissao = document.getElementById("nivel").value;

    if (!formularioValido || !permissao) {

        exibirToast(
            "erro",
            "Preencha todos os campos corretamente."
        );

        return false;
    }

    var nomeVar = document
        .getElementById("nome-colab")
        .value
        .trim();

    var emailVar = document
        .getElementById("email-colab")
        .value
        .trim();

    var senhaVar = document
        .getElementById("senha-colab")
        .value
        .trim();

    var permissaoVar = document
        .getElementById("nivel")
        .value;

    var idEmpresaVar = sessionStorage.getItem("ID_EMPRESA");

    if (!idEmpresaVar) {

        exibirToast(
            "erro",
            "Empresa não identificada. Faça login novamente."
        );

        return false;
    }

    try {

        const resposta = await fetch(
            "/usuariosAdmin/funcionarios/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nomeServer: nomeVar,
                    emailPessoalServer: emailVar,
                    senhaServer: senhaVar,
                    permissaoServer: permissaoVar,
                    idEmpresaServer: idEmpresaVar
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            if (resposta.status == 409) {

                exibirToast(
                    "erro",
                    "Já existe um funcionário cadastrado com este e-mail."
                );

                return false;
            }

            throw new Error(
                dados.mensagem || "Erro ao cadastrar funcionário."
            );
        }

        exibirToast(
            "sucesso",
            "Funcionário cadastrado com sucesso!"
        );

        limparCampos([
            "nome-colab",
            "email-colab",
            "senha-colab"
        ]);

        document.getElementById("nivel").value = "";

        chkNome = false;
        chkEmail = false;
        chkSenha = false;

    } catch (erro) {

        console.error("#ERRO:", erro);

        exibirToast(
            "erro",
            erro.message || "Erro ao cadastrar funcionário."
        );
    }

    return false;
}

function cancelar() {

    exibirToast(
        "sucesso",
        "Cadastro cancelado com sucesso."
    );

    setTimeout(() => {

        window.location.href =
            "../usuario/lista-funcionarios.html";

    }, 1000);
}

document
    .getElementById("btn-cadastrar")
    .addEventListener("click", cadastrarFuncionario);

document
    .getElementById("btn-cancelar")
    .addEventListener("click", cancelar);