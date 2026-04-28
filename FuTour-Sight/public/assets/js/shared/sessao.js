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