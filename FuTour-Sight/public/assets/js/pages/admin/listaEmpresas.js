function listarEmpresas() {
    fetch("/adminFutour/listarEmpresas", {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then((empresas) => {
            listaEmpresasCadastradas = empresas;

            const tbody = document.getElementById("tbody-empresas");
            tbody.innerHTML = "";

            empresas.forEach((empresa) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${empresa.nome}</td>
                    <td>${empresa.cnpj}</td>
                    <td>${empresa.email}</td>
                    <td>${empresa.telefone}</td>
                    <td>${empresa.status}</td>
                    <td>${empresa.total_usuarios}</td>
                    <td>
                        <button onclick="alterarStatusEmpresa(${empresa.id_empresa})">✕</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

function listarEmpresasProcuradas() {
    var nomeEmpresaVar = nome.value;

    fetch(`/adminFutour/listarEmpresasProcuradas?nome=${nomeEmpresaVar}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status == 204) {
                alert("Nenhum resultado encontrado!");
                return;
            }
            if (!resposta.ok) {
                throw new Error("Erro: " + resposta.status);
            }
            return resposta.json();
        })
        .then((dados) => {
            if (!dados) return;

            const tbody = document.getElementById("tbody-empresas");
            tbody.innerHTML = "";

            dados.forEach((empresa) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${empresa.nome}</td>
                    <td>${empresa.cnpj}</td>
                    <td>${empresa.email}</td>
                    <td>${empresa.telefone}</td>
                    <td>${empresa.status}</td>
                    <td>${empresa.total_usuarios}</td>
                    <td>
                        <button onclick="alterarStatusEmpresa(${empresa.id_empresa})">✕</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });

    return false;
}

function alterarStatusEmpresa(id) {
    fetch(`/adminFutour/editarStatusEmpresa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao atualizar status");
            return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado.mensagem);
            listarEmpresas();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}