function mostrarToast(mensagem, tipo = "sucesso") {
    const toast = document.getElementById("toast");
    const texto = document.getElementById("toastMensagem");

    toast.className = `toast ${tipo}`;
    texto.innerText = mensagem;

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

function abrirModalConfirmacao({
    titulo = "Confirmação",
    texto = "Deseja continuar?",
    onConfirm = () => {}
}) {

    const modal = document.getElementById("modalConfirmacao");

    document.getElementById("modalTitulo").innerText = titulo;
    document.getElementById("modalTexto").innerText = texto;

    modal.classList.remove("hidden");

    const btnConfirmar = document.getElementById("btnConfirmarModal");
    const btnCancelar = document.getElementById("btnCancelarModal");

    btnConfirmar.onclick = () => {
        modal.classList.add("hidden");
        onConfirm();
    };

    btnCancelar.onclick = () => {
        modal.classList.add("hidden");
    };
}

function limparCampos(ids = []) {
    ids.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });
}

function obterPermissao() {
    return Number(sessionStorage.getItem("NIVEL_ACESSO"));
}

function usuarioEhProprietario() {
    return obterPermissao() === 2;
}

function usuarioEhGerente() {
    return obterPermissao() === 3;
}

function validarPermissao(permissoesPermitidas = []) {
    const permissao = obterPermissao();

    return permissoesPermitidas.includes(permissao);
}

function esconderElementoSemPermissao(elementId, permissoes = []) {
    const elemento = document.getElementById(elementId);

    if (!elemento) return;

    if (!validarPermissao(permissoes)) {
        elemento.style.display = "none";
    }
}

async function tratarRespostaFetch(resposta) {
    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.mensagem || "Erro inesperado");
    }

    return data;
}

function preencherNomeUsuario() {
    const nomeUsuario = sessionStorage.getItem("NOME_USUARIO");

    const elementos = document.querySelectorAll("#nomeUser, #nomeUser-sidebar");

    elementos.forEach((el) => {
        if (el) {
            el.innerHTML = nomeUsuario || "Usuário";
        }
    });
}