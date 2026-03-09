const container = document.querySelector('.container');
const btnProximo = document.querySelector('.register-btn'); 
const btnVoltar = document.querySelector('.login-btn');   

btnProximo.addEventListener('click', () => {
    container.classList.add('active');
});

btnVoltar.addEventListener('click', () => {
    container.classList.remove('active');
});