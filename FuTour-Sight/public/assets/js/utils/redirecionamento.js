const usuario = {
    id: Number(sessionStorage.getItem("ID_USUARIO")),
    nome: sessionStorage.getItem("NOME_USUARIO"),
    email: sessionStorage.getItem("EMAIL_USUARIO"),
    nivelAcesso: sessionStorage.getItem("NIVEL_ACESSO"),
    idEmpresa: Number(sessionStorage.getItem("ID_EMPRESA")),
    primeiroAcesso: Number(sessionStorage.getItem("PRIMEIRO_ACESSO"))
};

const permissoes = {
    GERENTE: 'EMPRESA_ADMIN',
    MARKETING: 'EMPRESA_USER'
};

const rotas = {
    dashboard: './dashboard.html',
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

    const nivelUsuario =
        usuario.nivelAcesso
            ?.trim()
            .toUpperCase();

    return permissoesPermitidas
        .map(p => p.trim().toUpperCase())
        .includes(nivelUsuario);
}

function redirecionarDashboard() {
    window.location.href = rotas.dashboard;
}

function renderizarDashboard() {
    const elementosGerente = document.querySelectorAll('.gerente');
    const elementosMarketing = document.querySelectorAll('.marketing');

    if (usuario.nivelAcesso === permissoes.GERENTE) {
        elementosGerente.forEach(elemento => {
            elemento.classList.remove('exibindo');
        });

        elementosMarketing.forEach(elemento => {
            elemento.classList.add('exibindo');
        });
    }

    if (usuario.nivelAcesso === permissoes.MARKETING) {
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
            permissoes.GERENTE
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
            permissoes.GERENTE
        ])
    ) {
        window.location.href = rotas.listarFuncionarios;
    }
}

function redirecionarCadastroFuncionario() {
    if (
        verificarPermissao([
            permissoes.GERENTE
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

    const elementosRestritos =
        document.querySelectorAll("[data-permissao]");

    console.log(elementosRestritos);

    elementosRestritos.forEach((elemento) => {

        const permissoesPermitidas =
            elemento.dataset.permissao
                .split(",");

        console.log("Elemento:", elemento);
        console.log("Permissões:", permissoesPermitidas);

        const possuiPermissao =
            verificarPermissao(permissoesPermitidas);

        console.log("Possui?", possuiPermissao);

        if (!possuiPermissao) {
            elemento.remove();
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