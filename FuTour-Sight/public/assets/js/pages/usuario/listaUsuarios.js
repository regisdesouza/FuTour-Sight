// ================================================
// listaUsuario.js
// ================================================
// HTML necessário (adicionar antes do </body>):
//
// <!-- Toast de notificação -->
// <div id="toast" class="toast hidden">
//   <span id="toastMensagem"></span>
// </div>
//
// <!-- Modal de confirmação -->
// <div id="modalConfirmacao" class="modal hidden">
//   <div class="modal-content">
//     <h3 id="modalTitulo"></h3>
//     <p id="modalTexto"></p>
//     <div class="modal-botoes">
//       <button id="btnCancelarModal">Cancelar</button>
//       <button id="btnConfirmarModal">Confirmar</button>
//     </div>
//   </div>
// </div>
// ================================================

preencherNomeUsuario();

const inputBusca = document.getElementById("input-busca");
const btnBusca   = document.getElementById("btn-busca");

btnBusca.addEventListener("click", listarUsuariosProcurados);

inputBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") listarUsuariosProcurados();
});

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById("tbody-funcionarios");
    tbody.innerHTML = "";

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Nenhum funcionário encontrado.</td></tr>";
        return;
    }

    usuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.nivel_permissao}</td>
            <td>${usuario.empresa}</td>
            <td>${usuario.status}</td>
            <td>${usuario.email}</td>
            <td>
                <button onclick="confirmarAlterarStatus(${usuario.id_usuario})">
                    <img src="../assets/images/icons/x.png" alt="botão de X">
                </button>
                <button onclick="editarPerfil(${usuario.id_usuario})">
                    <img src="../assets/images/icons/editar.png" alt="botão de editar">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function listarUsuarios() {
    var idEmpresaVar = sessionStorage.getItem("ID_EMPRESA");

    fetch(`/usuariosAdmin/listarUsuarios?idEmpresa=${idEmpresaVar}`, {
        method: "GET",
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((usuarios) => {
        renderizarUsuarios(usuarios);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast("Erro ao listar funcionários.", "erro");
    });
}

function listarUsuariosProcurados() {
    var idEmpresaVar       = sessionStorage.getItem("ID_EMPRESA");
    var nomeFuncionarioVar = inputBusca.value.trim();

    if (!nomeFuncionarioVar) {
        listarUsuarios();
        return;
    }

    fetch(`/usuariosAdmin/listarUsuariosProcurados?idEmpresa=${idEmpresaVar}&nomeFuncionarioServer=${nomeFuncionarioVar}`, {
        method: "GET",
    })
    .then((resposta) => {
        if (resposta.status === 204) {
            renderizarUsuarios([]);
            return null;
        }
        return tratarRespostaFetch(resposta);
    })
    .then((dados) => {
        if (!dados) return;
        renderizarUsuarios(dados);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast("Erro ao buscar funcionários.", "erro");
    });
}

function confirmarAlterarStatus(id) {
    abrirModalConfirmacao({
        titulo: "Alterar status",
        texto:  "Tem certeza que deseja alterar o status deste funcionário?",
        onConfirm: () => alterarStatus(id)
    });
}

function alterarStatus(id) {
    fetch(`/usuariosAdmin/editarStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "INATIVO" }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((resultado) => {
        console.log(resultado.mensagem);
        mostrarToast("Status alterado com sucesso!", "sucesso");
        listarUsuarios();
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao atualizar status.", "erro");
    });
}

function editarPerfil(id) {
    sessionStorage.setItem("ID_USUARIO_EDITAR", id);
    window.location.href = "./editar-funcionario.html";
}

listarUsuarios();
