const div_empresa_selecionada = document.querySelector('.empresa-selecionada')
const botao_fechar_empresa = document.querySelector('.botao-fechar-empresa')
const lista_solicitacoes = document.querySelector('.solicitacoes-empresas')

botao_fechar_empresa.addEventListener('click', () => {
    div_empresa_selecionada.classList.remove('selecionado')
})

function abrirSolicitacao(solicitacao) {
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(1) span').textContent = solicitacao.nome_empresa
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(2) span').textContent = solicitacao.cnpj_empresa
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(3) span').textContent = solicitacao.email_empresa
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(4) span').textContent = solicitacao.telefone_empresa
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(5) span').textContent = solicitacao.nome_responsavel
    div_empresa_selecionada.querySelector('.infos-empresa p:nth-child(6) span').textContent = solicitacao.email_responsavel

    const [btnNegar, btnAprovar] = div_empresa_selecionada.querySelectorAll('.botoes-confirmacao button')

    const btnNegarNovo = btnNegar.cloneNode(true)
    const btnAprovarNovo = btnAprovar.cloneNode(true)
    btnNegar.replaceWith(btnNegarNovo)
    btnAprovar.replaceWith(btnAprovarNovo)

    btnNegarNovo.addEventListener('click', () => cancelarSolicitacao(solicitacao.id_solicitacao))
    btnAprovarNovo.addEventListener('click', () => aprovarSolicitacao(solicitacao.id_solicitacao))

    div_empresa_selecionada.classList.add('selecionado')
}

function listarSolicitacoes() {
    fetch("/adminFutour/buscarSolicitacoes", {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status == 204) {
                lista_solicitacoes.innerHTML = "<p>Nenhuma solicitação encontrada.</p>"
                return
            }

            if (!resposta.ok) throw new Error("Erro na resposta do servidor")

            return resposta.json()
        })
        .then((dados) => {
            if (!dados) return

            lista_solicitacoes.innerHTML = ""

            dados.forEach((s) => {
                const li = document.createElement("li")

                li.innerHTML = `
                    <img src="https://placehold.co/346x220/png" alt="imagem da empresa">
                    <div class="infos-empresa">
                        <p>Empresa: ${s.nome_empresa}</p>
                        <p>E-mail da empresa: ${s.email_empresa}</p>
                    </div>
                `

                li.addEventListener('click', () => abrirSolicitacao(s))

                lista_solicitacoes.appendChild(li)
            })
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

function aprovarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoesAprovar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
<<<<<<< Updated upstream
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao aprovar solicitação")
            return resposta.json()
        })
        .then((resultado) => {
            console.log(resultado.mensagem)
            div_empresa_selecionada.classList.remove('selecionado')
            listarSolicitacoes()
        })
        .catch((erro) => console.error("#ERRO:", erro))
=======
        .then(async (resposta) => {
            const data = await resposta.json()

            if (!resposta.ok) throw new Error("Erro ao aprovar solicitação")
            return resposta.json()
        })
        .then((resultado) => {
            console.log(resultado.mensagem)
            div_empresa_selecionada.classList.remove('selecionado')
            listarSolicitacoes()
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        }
        )
>>>>>>> Stashed changes
}

function cancelarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoesCancelar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao cancelar solicitação")
            return resposta.json()
        })
        .then((resultado) => {
            console.log(resultado.mensagem)
            div_empresa_selecionada.classList.remove('selecionado')
            listarSolicitacoes()
        })
        .catch((erro) => console.error("#ERRO:", erro))
}

listarSolicitacoes()