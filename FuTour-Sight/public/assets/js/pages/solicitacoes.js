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

