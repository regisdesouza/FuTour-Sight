// ================================================
// edicaoFiltro.js
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
// Nos campos do formulário, adicionar divs de erro:
// <div id="div_msg_nome_filtro" class="msg-erro"></div>
// <div id="div_msg_mes_inicio"  class="msg-erro"></div>
// <div id="div_msg_mes_final"   class="msg-erro"></div>
// <div id="div_msg_ano"         class="msg-erro"></div>
// <div id="div_msg_estados"     class="msg-erro"></div>
// <div id="div_msg_paises"      class="msg-erro"></div>
// ================================================

var chkNomeFiltro = false;
var chkMesInicio  = false;
var chkMesFinal   = false;
var chkAno        = false;

let estadosSelecionados = [];
let paisesSelecionados  = [];

function onkey_nome_filtro() {
    var erro = validarNomeFiltro(document.getElementById("nome-filtro").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_nome_filtro").innerHTML = erro;
        chkNomeFiltro = false;
    } else {
        document.getElementById("div_msg_nome_filtro").innerHTML = "";
        chkNomeFiltro = true;
    }
}

function onkey_mes_inicio() {
    var erro = validarMes(document.getElementById("mes-inicio").value);

    if (erro != "") {
        document.getElementById("div_msg_mes_inicio").innerHTML = erro;
        chkMesInicio = false;
    } else {
        document.getElementById("div_msg_mes_inicio").innerHTML = "";
        chkMesInicio = true;
    }
}

function onkey_mes_final() {
    var mesInicio = document.getElementById("mes-inicio").value;
    var mesFinal  = document.getElementById("mes-final").value;
    var erro = validarPeriodo(mesInicio, mesFinal);

    if (erro != "") {
        document.getElementById("div_msg_mes_final").innerHTML = erro;
        chkMesFinal = false;
    } else {
        document.getElementById("div_msg_mes_final").innerHTML = "";
        chkMesFinal = true;
    }
}

function onkey_ano() {
    var erro = validarAno(document.getElementById("ano-referencia").value);

    if (erro != "") {
        document.getElementById("div_msg_ano").innerHTML = erro;
        chkAno = false;
    } else {
        document.getElementById("div_msg_ano").innerHTML = "";
        chkAno = true;
    }
}

function buscarFiltro() {
    fetch(`/usuarios/buscarFiltro/${sessionStorage.getItem("ID_FILTRO")}`)
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((filtros) => {
        const filtro = filtros[0];
        console.log(filtro);

        estadosSelecionados = filtro.estados ? filtro.estados.split(",") : [];
        paisesSelecionados  = filtro.paises  ? filtro.paises.split(",")  : [];

        renderizarEstados();
        renderizarPaises();

        document.getElementById("nome-filtro").value  = filtro.nome;
        document.getElementById("mes-inicio").value   = filtro.mes_inicio;
        document.getElementById("mes-final").value    = filtro.mes_fim;
        document.getElementById("ano-referencia").value = filtro.ano_referencia;

        chkNomeFiltro = true;
        chkMesInicio  = true;
        chkMesFinal   = true;
        chkAno        = true;
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast("Erro ao carregar filtro.", "erro");
    });
}

function adicionarEstado() {
    const select = document.getElementById("estado-destino");
    const valor  = select.value;
    const texto  = select.options[select.selectedIndex].text;

    if (!valor) return;

    if (!estadosSelecionados.includes(texto)) {
        estadosSelecionados.push(texto);
        renderizarEstados();
    }

    select.value = "";
}

function renderizarEstados() {
    const ul = document.querySelector("#estado-destino + ul");
    ul.innerHTML = "";

    estadosSelecionados.forEach((estado, index) => {
        ul.innerHTML += `
            <li class="item">
                <span>${estado}</span>
                <button onclick="removerEstado(${index})">X</button>
            </li>
        `;
    });
}

function removerEstado(index) {
    estadosSelecionados.splice(index, 1);
    renderizarEstados();
}

function adicionarPais() {
    const select = document.getElementById("pais-origem");
    const valor  = select.value;
    const texto  = select.options[select.selectedIndex].text;

    if (!valor) return;

    if (!paisesSelecionados.includes(texto)) {
        paisesSelecionados.push(texto);
        renderizarPaises();
    }

    select.value = "";
}

function renderizarPaises() {
    const ul = document.querySelector("#pais-origem + ul");
    ul.innerHTML = "";

    paisesSelecionados.forEach((pais, index) => {
        ul.innerHTML += `
            <li class="item">
                <span>${pais}</span>
                <button onclick="removerPais(${index})">X</button>
            </li>
        `;
    });
}

function removerPais(index) {
    paisesSelecionados.splice(index, 1);
    renderizarPaises();
}

function renderizarOptionsEstados() {
    fetch("/usuarios/listarEstados", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((estados) => {
        const select = document.getElementById("estado-destino");
        estados.forEach(estado => {
            select.innerHTML += `<option value="${estado.uf}">${estado.uf}</option>`;
        });
    });
}

function renderizarOptionsPaises() {
    fetch("/usuarios/listarPaises", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((paises) => {
        const select = document.getElementById("pais-origem");
        paises.forEach(pais => {
            select.innerHTML += `<option value="${pais.nome_pais_origem}">${pais.nome_pais_origem}</option>`;
        });
    });
}

function renderizarOptionsAnos() {
    fetch("/usuarios/listarAnos", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((anos) => {
        const select = document.getElementById("ano-referencia");
        anos.forEach(ano => {
            select.innerHTML += `<option value="${ano.ano}">${ano.ano}</option>`;
        });
    });
}

function atualizarFiltro() {
    onkey_nome_filtro();
    onkey_mes_inicio();
    onkey_mes_final();
    onkey_ano();

    var erroEstados = validarSelectMultiplo(estadosSelecionados);
    document.getElementById("div_msg_estados").innerHTML = erroEstados;

    var erroPaises = validarSelectMultiplo(paisesSelecionados);
    document.getElementById("div_msg_paises").innerHTML = erroPaises;

    const temErro = chkNomeFiltro && chkMesInicio && chkMesFinal && chkAno
        && erroEstados === "" && erroPaises === "";

    if (!temErro) {
        mostrarToast("Preencha todos os campos corretamente.", "erro");
        return false;
    }

    const nomeFiltro = document.getElementById("nome-filtro").value;
    const mes_inicio = document.getElementById("mes-inicio").value;
    const mes_final  = document.getElementById("mes-final").value;
    const ano        = document.getElementById("ano-referencia").value;

    fetch(`/usuarios/atualizarFiltro/${sessionStorage.getItem("ID_FILTRO")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeFiltro:  nomeFiltro,
            estados:     estadosSelecionados,
            paises:      paisesSelecionados,
            mes_inicio:  mes_inicio,
            mes_fim:     mes_final,
            ano:         ano,
            fkUsuario:   sessionStorage.getItem("ID_USUARIO")
        }),
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => {
        mostrarToast("Filtro atualizado com sucesso!", "sucesso");
        setTimeout(() => {
            window.location.href = "../../../usuario/filtros.html";
        }, 1500);
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        mostrarToast(erro.message || "Erro ao atualizar filtro.", "erro");
    });

    return false;
}

function cancelarAtualizacaoFiltro() {
    window.location.href = "../../../usuario/filtros.html";
}

renderizarOptionsEstados();
renderizarOptionsPaises();
renderizarOptionsAnos();
buscarFiltro();
