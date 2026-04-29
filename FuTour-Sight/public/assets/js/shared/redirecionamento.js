const permissaoUsuario = Number(sessionStorage.getItem("NIVEL_ACESSO"))

function redirecionarDashboard() {
    if (permissaoUsuario === 2) {
        window.location.href = "./dashboard-proprietario.html"
    } else if (permissaoUsuario === 3) {
        window.location.href = "./dashboard-gerente.html";
    }
}

function redirecionarEdicaoEmpresa() {
    if (permissaoUsuario === 2) {
        window.location.href = "./edicao-empresa.html"
    } else if (permissaoUsuario === 3) {
        alert("Você não tem permissão para acessar essa página");
    }
}

function redirecionarPerfil() {
    window.location.href = "./editar-perfil.html"
}

function redirecionarListFuncionario() {
    if (permissaoUsuario === 2) {
        window.location.href = "./lista-funcionarios.html"
    } else if (permissaoUsuario === 3) {
        alert("Você não tem permissão para acessar essa página");
    }
}

function filtro() {
    window.location.href = "./filtros.html"
}

function sair() {
    sessionStorage.ID_USUARIO = "";
    sessionStorage.NOME_USUARIO = "";
    sessionStorage.EMAIL_USUARIO = "";
    sessionStorage.NIVEL_ACESSO = "";
    sessionStorage.ID_EMPRESA = "";
    sessionStorage.PRIMEIRO_ACESSO = "";

    window.location.href = "../index.html"
}

function cadastrarFuncionario() {
    window.location.href = "./cadastro-func.html"

}