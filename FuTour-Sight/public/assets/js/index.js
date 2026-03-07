const ipt_menu_hamburguer = document.getElementById('menu-hamburguer');

const botao_home = document.getElementById('botao-home');
const botao_contato = document.getElementById('botao-contato');

const array_botoes = [botao_home, botao_contato];

array_botoes.forEach(botao => {
    botao.addEventListener('click', () => fecharMenuHamburguer())
});

function fecharMenuHamburguer() {
    ipt_menu_hamburguer.checked = false;
};