const inputBusca = document.getElementById("input-busca");
const btnBusca = document.getElementById("btn-busca");

btnBusca.addEventListener("click", listarEmpresasProcuradas);

inputBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") listarEmpresasProcuradas();
});

function renderizarEmpresas(empresas) {
    const tbody = document.getElementById("tbody-empresas");
    tbody.innerHTML = "";

    if (!empresas || empresas.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Nenhuma empresa encontrada.</td></tr>";
        return;
    }


    empresas.forEach((empresa) => {
        const tr = document.createElement("tr");
        if (empresa.status != "INATIVO") {
            tr.innerHTML = `
            <td>${empresa.nome}</td>
            <td>${empresa.cnpj}</td>
            <td>${empresa.email}</td>
            <td>${empresa.telefone}</td>
            <td>${empresa.status}</td>
            <td>
                <button onclick="confirmarAlterarStatusEmpresa(${empresa.id_empresa})">
                    <img src="../assets/images/icons/x.png" alt="botão de X">
                </button>
                <button onclick="editarEmpresa(${empresa.id_empresa})">
                    <img src="../assets/images/icons/editar.png" alt="botão de editar">
                </button>
            </td>
        `;
        }

        tbody.appendChild(tr);
    });
}

function listarEmpresas() {
    fetch("/adminFutour/empresas", { method: "GET" })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((empresas) => {
            renderizarEmpresas(empresas);
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao listar empresas");
        });
}

function listarEmpresasProcuradas() {
    var nomeEmpresaVar = inputBusca.value.trim();

    if (!nomeEmpresaVar) {
        listarEmpresas();
        return;
    }

    fetch(`/adminFutour/empresas/procuradas?empresaServer=${nomeEmpresaVar}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status === 204) {
                renderizarEmpresas([]);
                return null;
            }
            return tratarRespostaFetch(resposta);
        })
        .then((dados) => {
            if (!dados) return;
            renderizarEmpresas(dados);
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao buscar empresas");
        });
}

function confirmarAlterarStatusEmpresa(id) {
    abrirModalConfirmacao({
        titulo: "Alterar status da empresa",
        texto: "Tem certeza que deseja alterar o status desta empresa?",
        onConfirm: () => alterarStatusEmpresa(id)
    });
}

function alterarStatusEmpresa(id) {
    fetch(`/adminFutour/empresas/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((resultado) => {
            console.log(resultado.mensagem);
            exibirToast("sucesso", "Status da empresa alterado com sucesso!");
            listarEmpresas();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao atualizar status da empresa")
        });
}

function editarEmpresa(idEmpresa) {
    sessionStorage.setItem("ID_EMPRESA_EDITAR", idEmpresa);

    window.location.href = "./editar-empresa.html";
}

listarEmpresas();