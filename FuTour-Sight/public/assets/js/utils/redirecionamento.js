const usuario = {
    id: Number(sessionStorage.getItem("ID_USUARIO")),
    nome: sessionStorage.getItem("NOME_USUARIO"),
    email: sessionStorage.getItem("EMAIL_USUARIO"),
    nivelAcesso: Number(sessionStorage.getItem("NIVEL_ACESSO")),
    idEmpresa: Number(sessionStorage.getItem("ID_EMPRESA")),
    primeiroAcesso: Number(sessionStorage.getItem("PRIMEIRO_ACESSO"))
};

const permissoes = {
    PROPRIETARIO: 2,
    GERENTE: 3
};

const rotas = {
    dashboard: './dashboard.html',
    dashboardProprietario: "./dashboard-proprietario.html",
    dashboardGerente: "./dashboard-gerente.html",
    editarEmpresa: "./edicao-empresa.html",
    editarPerfil: "./editar-perfil.html",
    listarFuncionarios: "./lista-funcionarios.html",
    cadastrarFuncionario: "./cadastro-func.html",
    filtros: "./filtros.html",
    login: "../index.html"
};

function usuarioLogado() {
    return !!usuario.id;
}

function verificarPermissao(permissoesPermitidas = []) {
    return permissoesPermitidas.includes(usuario.nivelAcesso);
}

function redirecionarDashboard() {
    window.location.href = rotas.dashboard;
}

function renderizarDashboard() {
    const elementosGerente = document.querySelectorAll('.gerente');
    const elementosMarketing = document.querySelectorAll('.marketing');

    if (usuario.nivelAcesso === permissoes.PROPRIETARIO) {
        elementosGerente.forEach(elemento => {
            elemento.classList.remove('exibindo');
        });

        elementosMarketing.forEach(elemento => {
            elemento.classList.add('exibindo');
        });
    }

    if (usuario.nivelAcesso === permissoes.GERENTE) {
        elementosMarketing.forEach(elemento => {
            elemento.classList.remove('exibindo');
        });

        elementosGerente.forEach(elemento => {
            elemento.classList.add('exibindo');
        });
    }
}

function redirecionarEdicaoEmpresa() {
    if (
        verificarPermissao([
            permissoes.PROPRIETARIO
        ])
    ) {
        window.location.href = rotas.editarEmpresa;
    }
}

function redirecionarPerfil() {
    window.location.href = rotas.editarPerfil;
}

function redirecionarListFuncionario() {
    if (
        verificarPermissao([
            permissoes.PROPRIETARIO
        ])
    ) {
        window.location.href = rotas.listarFuncionarios;
    }
}

function redirecionarCadastroFuncionario() {
    if (
        verificarPermissao([
            permissoes.PROPRIETARIO
        ])
    ) {
        window.location.href = rotas.cadastrarFuncionario;
    }
}

function redirecionarFiltros() {
    window.location.href = rotas.filtros;
}

function sair() {
    sessionStorage.clear();

    window.location.href = rotas.login;
}

function ocultarElementosSemPermissao() {
    const elementosRestritos = document.querySelectorAll(
        "[data-permissao]"
    );

    elementosRestritos.forEach((elemento) => {
        const permissoesPermitidas =
            elemento.dataset.permissao
                .split(",")
                .map(Number);

        const possuiPermissao =
            verificarPermissao(permissoesPermitidas);

        if (!possuiPermissao) {
            elemento.style.display = "none";
        }
    });
}

function validarSessao() {
    if (!usuarioLogado()) {
        window.location.href = rotas.login;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    validarSessao();
    ocultarElementosSemPermissao();
});