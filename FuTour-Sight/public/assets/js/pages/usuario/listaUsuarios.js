const inputBusca = document.getElementById("input-busca")
const btnBusca = document.getElementById("btn-busca")

btnBusca.addEventListener("click", listarUsuariosProcurados)

inputBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") listarUsuariosProcurados()
})

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById("tbody-funcionarios")
    tbody.innerHTML = ""

    usuarios.forEach((usuario) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.nivel_permissao}</td>
            <td>${usuario.empresa}</td>
            <td>${usuario.status}</td>
            <td>${usuario.email}</td>
            <td>
                <button onclick="alterarStatus(${usuario.id_usuario})">
                    <img src="../assets/images/icons/x.png" alt="botão de X">
                </button>
            </td>
        `
        tbody.appendChild(tr)
    })
}

function listarUsuarios() {
    var idEmpresaVar = sessionStorage.ID_EMPRESA

    fetch(`/usuariosAdmin/listarUsuarios?idEmpresa=${idEmpresaVar}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro na resposta do servidor")
            return resposta.json()
        })
        .then((usuarios) => {
            renderizarUsuarios(usuarios)
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

function listarUsuariosProcurados() {
    var idEmpresaVar = sessionStorage.ID_EMPRESA
    var nomeFuncionarioVar = inputBusca.value.trim()

    if (!nomeFuncionarioVar) {
        listarUsuarios()
        return
    }

    fetch(`/usuariosAdmin/listarUsuariosProcurados?idEmpresa=${idEmpresaVar}&nomeFuncionarioServer=${nomeFuncionarioVar}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status == 204) {
                document.getElementById("tbody-funcionarios").innerHTML = "<tr><td colspan='6'>Nenhum funcionário encontrado.</td></tr>"
                return
            }
            if (!resposta.ok) throw new Error("Erro: " + resposta.status)
            return resposta.json()
        })
        .then((dados) => {
            if (!dados) return
            renderizarUsuarios(dados)
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

function alterarStatus(id) {
    const confirmado = confirm("Tem certeza que deseja alterar o status deste funcionário?")
    if (!confirmado) return

    fetch(`/usuariosAdmin/editarStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "INATIVO" }),
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao atualizar status")
            return resposta.json()
        })
        .then((resultado) => {
            console.log(resultado.mensagem)
            listarUsuarios()
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

listarUsuarios()