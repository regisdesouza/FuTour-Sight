function listarUsuarios() {
    fetch("/usuariosAdmin/listarUsuarios", {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }
            return resposta.json();
        })
        .then((usuarios) => {
            listaFuncionariosCadastrados = usuarios;

            const tbody = document.getElementById("tbody-funcionarios");
            tbody.innerHTML = "";

            usuarios.forEach((usuario) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.nivel_permissao}</td>
                    <td>${usuario.empresa}</td>
                    <td>${usuario.status}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button onclick="alterarStatus(${usuario.id_usuario})">✕</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

function listarUsuariosProcurados() {
    var idEmpresaVar = sessionStorage.ID_EMPRESA;
    var nomeFuncionarioVar = nome.value;

    fetch(`/adminFutour/listarUsuariosProcurados?idEmpresa=${idEmpresaVar}&nomeFuncionarioServer=${nomeFuncionarioVar}`)
        .then(function (resposta) {
            console.log("resposta:", resposta);

            if (resposta.status == 204) {
                alert("Nenhum resultado encontrado!");
                return;
            }

            if (resposta.ok) {
                return resposta.json();
            }

            throw new Error("Erro: " + resposta.status);
        })
        .then(function (dados) {
            console.log("Dados:", dados);

            const tbody = document.getElementById("tbody-funcionarios");
            tbody.innerHTML = "";

            dados.forEach((usuario) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.nivel_permissao}</td>
                    <td>${usuario.empresa}</td>
                    <td>${usuario.status}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button onclick="alterarStatus(${usuario.id_usuario})">✕</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(function (erro) {
            console.log("#ERRO:", erro);
        });

    return false;
}

function alterarStatus(id) {
    fetch(`/usuariosAdmin/editarStatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "INATIVO"
        }),
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao atualizar status");
            return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado.mensagem);
            listarUsuarios();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}