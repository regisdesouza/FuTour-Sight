var idUsuario = sessionStorage.getItem("ID_USUARIO_EDITAR");

document.getElementById("nomeUser").innerHTML = sessionStorage.getItem("NOME_USUARIO")

if (!idUsuario) {
    alert("Nenhum funcionário selecionado.");
    window.location.href = "../usuario/lista-funcionarios.html";
}

function buscarFuncionario() {
    fetch(`/usuariosAdmin/buscarFuncionario/${idUsuario}`, {
        method: "GET"
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Funcionário não encontrado");
            return resposta.json();
        })
        .then((dados) => {
            document.getElementById("nome-funcionario").value = dados.nome;
            document.getElementById("email").value = dados.email;
            document.getElementById("nivel-permissao").value = dados.fk_nivel_permissao;
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            alert("Erro ao carregar dados do funcionário.");
        });
}

function salvarEdicao() {
    var nome = document.getElementById("nome-funcionario").value.trim();
    var email = document.getElementById("email").value.trim();
    var permissao = document.getElementById("nivel-permissao").value;

    if (!nome || !email || !permissao) {
        exibirToast('erro', 'Preencha todos os campos')
        return;
    }

    fetch(`/usuariosAdmin/editarFuncionario/${idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nome,
            emailServer: email,
            permissaoServer: permissao
        })
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao salvar");
            exibirToast('erro', 'Erro ao salvar')
            return resposta.json();
        })
        .then(() => {
            // alert("Funcionário atualizado com sucesso!");
            ativarToast();
            sessionStorage.removeItem("ID_USUARIO_EDITAR");
            window.location.href = "../usuario/lista-funcionarios.html";
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            alert("Erro ao atualizar funcionário.");
        });
}

function cancelar() {
    sessionStorage.removeItem("ID_USUARIO_EDITAR");
    window.location.href = "../usuario/lista-funcionarios.html";
}

buscarFuncionario();