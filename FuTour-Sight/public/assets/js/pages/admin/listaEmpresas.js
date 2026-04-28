const inputBusca = document.getElementById("input-busca")
const btnBusca = document.getElementById("btn-busca")

btnBusca.addEventListener("click", listarEmpresasProcuradas)

inputBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") listarEmpresasProcuradas()
})

function renderizarEmpresas(empresas) {
    const tbody = document.getElementById("tbody-empresas")
    tbody.innerHTML = ""

    empresas.forEach((empresa) => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${empresa.nome}</td>
            <td>${empresa.cnpj}</td>
            <td>${empresa.email}</td>
            <td>${empresa.telefone}</td>
            <td>${empresa.status}</td>
            <td>
                <button onclick="alterarStatusEmpresa(${empresa.id_empresa})">
                    <img src="../assets/images/icons/x.png" alt="botão de X">
                </button>
                <button>
                    <img src="../assets/images/icons/editar.png" alt="botão de editar">
                </button>
            </td>
        `
        tbody.appendChild(tr)
    })
}

function listarEmpresas() {
    fetch("/adminFutour/listarEmpresas", {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro na resposta do servidor")
            return resposta.json()
        })
        .then((empresas) => {
            renderizarEmpresas(empresas)
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

function listarEmpresasProcuradas() {
    var nomeEmpresaVar = inputBusca.value.trim()

    if (!nomeEmpresaVar) {
        listarEmpresas()
        return
    }

    fetch(`/adminFutour/listarEmpresasProcuradas?empresaServer=${nomeEmpresaVar}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status == 204) {
                document.getElementById("tbody-empresas").innerHTML = "<tr><td colspan='6'>Nenhuma empresa encontrada.</td></tr>"
                return
            }
            if (!resposta.ok) throw new Error("Erro: " + resposta.status)
            return resposta.json()
        })
        .then((dados) => {
            if (!dados) return
            renderizarEmpresas(dados)
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

function alterarStatusEmpresa(id) {
    const confirmado = confirm("Tem certeza que deseja alterar o status desta empresa?")

    if (!confirmado) return

    fetch(`/adminFutour/editarStatusEmpresa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao atualizar status")
            return resposta.json()
        })
        .then((resultado) => {
            console.log(resultado.mensagem)
            listarEmpresas()
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

listarEmpresas()