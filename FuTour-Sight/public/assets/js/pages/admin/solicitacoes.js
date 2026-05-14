// ================================================
// login.js
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
//
// Elemento de mensagem de erro já existente no HTML:
// <p id="mensagemErro" class="msg-erro"></p>
// ================================================

const div_empresa_selecionada = document.querySelector(".empresa-selecionada");
const botao_fechar_empresa    = document.querySelector(".botao-fechar-empresa");
const lista_solicitacoes      = document.querySelector(".solicitacoes-empresas");

botao_fechar_empresa.addEventListener("click", () => {
    div_empresa_selecionada.classList.remove("selecionado");
});

function abrirSolicitacao(solicitacao) {
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(1) span").textContent = solicitacao.nome_empresa;
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(2) span").textContent = solicitacao.cnpj_empresa;
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(3) span").textContent = solicitacao.email_empresa;
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(4) span").textContent = solicitacao.telefone_empresa;
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(5) span").textContent = solicitacao.nome_responsavel;
    div_empresa_selecionada.querySelector(".infos-empresa p:nth-child(6) span").textContent = solicitacao.email_responsavel;

    const [btnNegar, btnAprovar] = div_empresa_selecionada.querySelectorAll(".botoes-confirmacao button");

    const btnNegarNovo  = btnNegar.cloneNode(true);
    const btnAprovarNovo = btnAprovar.cloneNode(true);
    btnNegar.replaceWith(btnNegarNovo);
    btnAprovar.replaceWith(btnAprovarNovo);

    btnNegarNovo.addEventListener("click",  () => confirmarCancelarSolicitacao(solicitacao.id_solicitacao));
    btnAprovarNovo.addEventListener("click", () => confirmarAprovarSolicitacao(solicitacao.id_solicitacao));

    div_empresa_selecionada.classList.add("selecionado");
}

function listarSolicitacoes() {
    fetch("/adminFutour/solicitacoes", { method: "GET" })
    .then((resposta) => {
        if (resposta.status === 204) {
            lista_solicitacoes.innerHTML = "<p>Nenhuma solicitação encontrada.</p>";
            return null;
        }
        return tratarRespostaFetch(resposta);
    })
    .then((dados) => {
        if (!dados) return;

        lista_solicitacoes.innerHTML = "";

        dados.forEach((s) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <img src="https://placehold.co/346x220/png" alt="imagem da empresa">
                <div class="infos-empresa">
                    <p>Empresa: ${s.nome_empresa}</p>
                    <p>E-mail da empresa: ${s.email_empresa}</p>
                </div>
            `;

            li.addEventListener("click", () => abrirSolicitacao(s));
            lista_solicitacoes.appendChild(li);
        });
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        // mostrarToast("Erro ao carregar solicitações.", "erro");
        exibirToast("erro", "Erro ao carregar solicitações");
    });
}

function confirmarAprovarSolicitacao(id) {
    abrirModalConfirmacao({
        titulo: "Aprovar solicitação",
        texto:  "Tem certeza que deseja aprovar esta solicitação?",
        onConfirm: () => aprovarSolicitacao(id)
    });
}

function aprovarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoes/${id}/aprovar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => {
        // mostrarToast("Solicitação aprovada com sucesso!", "sucesso");
        exibirToast("sucesso", "Solicitação aprovada com sucesso!");
        div_empresa_selecionada.classList.remove("selecionado");
        listarSolicitacoes();
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        const elErro = document.getElementById("mensagemErro");
        if (elErro) elErro.textContent = erro.message;
        // mostrarToast(erro.message || "Erro ao aprovar solicitação.", "erro");
        exibirToast("erro", "Erro ao aprovar solicitação");
    });
}

function confirmarCancelarSolicitacao(id) {
    abrirModalConfirmacao({
        titulo: "Recusar solicitação",
        texto:  "Tem certeza que deseja recusar esta solicitação?",
        onConfirm: () => cancelarSolicitacao(id)
    });
}

function cancelarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoes/${id}/cancelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((resultado) => {
        console.log(resultado.mensagem);
        // mostrarToast("Solicitação recusada.", "sucesso");
        exibirToast("sucesso", "Solicitação recusada");
        div_empresa_selecionada.classList.remove("selecionado");
        listarSolicitacoes();
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        // mostrarToast(erro.message || "Erro ao cancelar solicitação.", "erro");
        exibirToast("erro", "Erro ao cancelar solicitação");
    });
}

listarSolicitacoes();