function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErros = document.getElementById("div_erros");
    if (texto) {
        divErros.style.display = "flex";
        divErros.innerHTML = texto;
    }
}