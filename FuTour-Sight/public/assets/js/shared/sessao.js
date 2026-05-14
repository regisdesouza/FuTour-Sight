function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErros = document.getElementById("div_erros");

    if (texto) {
        divErros.style.display = "flex";
        divErros.innerHTML = texto;
    }
}

function sumirMensagem() {
    cardErro.style.display = "none";
}

// function ativarToast() {
//     localStorage.setItem("showToast", "true");
// }

// function verificarToast(tipo, mensagem) {
//     if (localStorage.getItem("showToast") === 'true') {
//         exibirToast(tipo, mensagem);
//     }

//     localStorage.removeItem('showToast')
// }

// const div_toast = document.getElementById("toast")
// let contador;

// function exibirToast(tipo, mensagem) {
//     div_toast.classList.add('exibindo')
//     let imagem;

//     if (tipo === "erro") {
//         div_toast.classList.add('erro')
//         imagem = `<img src="../../assets/images/icons/erro.png" alt="ícone de erro">`
//     } else if (tipo === "sucesso") {
//         div_toast.classList.add('sucesso')
//         imagem = `<img src="../../assets/images/icons/sucesso.png" alt="ícone de sucesso">`
//     }

//     div_toast.innerHTML = `
//         <div class="toast-content">
//             ${imagem}
//             <div class="toast-info">
//                 <p>${mensagem}</p>
//                 <button onclick="fecharToast()"><img src="../../assets/images/icons/x.png" alt="ícone de X"></button>
//             </div>
//         </div>
//         <div id="barra-tempo"></div>
//         `

//     const barraTempo = document.getElementById("barra-tempo")
//     let tempoTotal = 5000;
//     let tempoRestante = tempoTotal;

//     clearInterval(contador);
//     barraTempo.style.width = "100%";

//     contador = setInterval(() => {
//         tempoRestante -= 10;
//         let porcentagemTempo = (tempoRestante / tempoTotal) * 100;
//         barraTempo.style.width = porcentagemTempo + "%";
        
//         if (tempoRestante <= 0) {            
//             fecharToast();
//         }
//     }, 10)
// }

// function fecharToast() {
//     div_toast.classList.remove('exibindo');
//     clearInterval(contador);
//     localStorage.removeItem('showToast')
// }