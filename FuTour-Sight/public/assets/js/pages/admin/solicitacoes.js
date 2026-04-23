const solicitacoes = document.querySelectorAll(".solicitacoes-empresas li")
const div_empresa_selecionada = document.querySelector('.empresa-selecionada')
const botao_fechar_empresa = document.querySelector('.botao-fechar-empresa')

solicitacoes.forEach(solicitacao => {
  console.log(solicitacao);

  solicitacao.addEventListener('click', () => {
    console.log('clicou');


    div_empresa_selecionada.classList.add('selecionado')
  })
})

botao_fechar_empresa.addEventListener('click', () => {
  div_empresa_selecionada.classList.remove('selecionado')
})

function listarSolicitacoes() {
    fetch("/adminFutour/buscarSolicitacoes", {
        method: "GET",
    })
        .then((resposta) => {
            if (resposta.status == 204) {
                alert("Nenhuma solicitação encontrada!");
                return;
            }

            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }

            return resposta.json();
        })
        .then((dados) => {
            if (!dados) return;

            const div = document.getElementById("lista");
            div.innerHTML = "";

            dados.forEach((s) => {
                const bloco = document.createElement("div");

                bloco.innerHTML = `
                    <p>${s.nome_responsavel} - ${s.nome_empresa}</p>
                    
                    <button onclick="aprovarSolicitacao(${s.id_solicitacao})">
                        Aprovar
                    </button>

                    <button onclick="cancelarSolicitacao(${s.id_solicitacao})">
                        Cancelar
                    </button>
                `;

                div.appendChild(bloco);
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

function aprovarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoesAprovar/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro ao aprovar solicitação");
            }

            return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado.mensagem);
            listarSolicitacoes();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

function cancelarSolicitacao(id) {
    fetch(`/adminFutour/solicitacoesCancelar/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro ao cancelar solicitação");
            }

            return resposta.json();
        })
        .then((resultado) => {
            console.log(resultado.mensagem);
            listarSolicitacoes();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
        });
}

listarSolicitacoes();