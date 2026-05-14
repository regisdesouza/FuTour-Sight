// ================================================
// filtros.js
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
// <div id="div_msg_nome_filtro"  class="msg-erro"></div>
// <div id="div_msg_mes_inicio"   class="msg-erro"></div>
// <div id="div_msg_mes_final"    class="msg-erro"></div>
// <div id="div_msg_ano"          class="msg-erro"></div>
// <div id="div_msg_estados"      class="msg-erro"></div>
// <div id="div_msg_paises"       class="msg-erro"></div>
// ================================================

preencherNomeUsuario();

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

function salvarFiltro() {
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
        exibirToast("erro", "Preencha todos os campos corretamente");
        return false;
    }

    const nomeFiltro = document.getElementById("nome-filtro").value;
    const mes_inicio = document.getElementById("mes-inicio").value;
    const mes_final  = document.getElementById("mes-final").value;
    const ano        = document.getElementById("ano-referencia").value;

    fetch("/usuarios/filtros", {
        method: "POST",
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
        exibirToast("sucesso", "Filtro salvo com sucesso!");
        carregarFiltros();
        limparCamposFiltro();
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao salvar filtro.");
    });

    return false;
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

function carregarFiltros() {
    const ul_filtros              = document.getElementById("ul_filtros");
    const p_quantidade_filtros    = document.getElementById("pQuantidadeFiltros");
    const idUsuario               = sessionStorage.getItem("ID_USUARIO");

    fetch(`/usuarios/filtros?idUsuario=${idUsuario}`, {
        method: "GET",
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then((filtros) => {
        if (filtros.length === 0) {
            p_quantidade_filtros.innerHTML = "0 filtros salvos";
        } else if (filtros.length === 1) {
            p_quantidade_filtros.innerHTML = "1 filtro salvo";
        } else {
            p_quantidade_filtros.innerHTML = `${filtros.length} filtros salvos`;
        }

        ul_filtros.innerHTML = "";

        filtros.forEach(filtro => {
            const primeirosEstados  = filtro.estados.slice(0, 3);
            const restanteEstados   = filtro.estados.length - 3;
            let stringEstados       = primeirosEstados.join(", ");
            if (restanteEstados > 0) stringEstados += ` +${restanteEstados}`;

            const primeirosPaises   = filtro.paises.slice(0, 1);
            const restantePaises    = filtro.paises.length - 1;
            let stringPaises        = primeirosPaises.join(", ");
            if (restantePaises > 0) stringPaises += ` +${restantePaises}`;

            const stringInfoFiltro  = stringEstados
                + (stringPaises !== "" && stringEstados !== "" ? " - " : "")
                + stringPaises;

            ul_filtros.innerHTML += `
                <li class="filtro">
                    <div class="infos-filtro-container">
                        <div class="icone-filtro">
                            <span>${filtro.nome[0]}</span>
                        </div>
                        <div class="infos-filtro">
                            <h4>${filtro.nome}</h4>
                            <p>${stringInfoFiltro}</p>
                        </div>
                    </div>
                    <div class="botoes">
                        <button onclick="editarFiltro(${filtro.id})">Editar</button>
                        <button onclick="confirmarExcluirFiltro(${filtro.id})">Excluir</button>
                    </div>
                </li>
            `;
        });
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao carregar filtros");
    });
}

function confirmarExcluirFiltro(idFiltro) {
    abrirModalConfirmacao({
        titulo: "Excluir filtro",
        texto:  "Tem certeza que deseja excluir este filtro?",
        onConfirm: () => excluirFiltro(idFiltro)
    });
}

function excluirFiltro(idFiltro) {
    fetch(`/usuarios/filtros/${idFiltro}`, {
        method: "DELETE"
    })
    .then((resposta) => tratarRespostaFetch(resposta))
    .then(() => {
        exibirToast("sucesso", "Filtro excluído com sucesso!");
        carregarFiltros();
    })
    .catch((erro) => {
        console.error("#ERRO:", erro);
        exibirToast("erro", "Erro ao excluir filtro");
    });
}

function renderizarOptionsEstados() {
    fetch("/usuarios/estados", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((estados) => {
        const select = document.getElementById("estado-destino");
        estados.forEach(estado => {
            select.innerHTML += `<option value="${estado.uf}">${estado.uf}</option>`;
        });
    });
}

function renderizarOptionsPaises() {
    fetch("/usuarios/paises", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((paises) => {
        const select = document.getElementById("pais-origem");
        paises.forEach(pais => {
            select.innerHTML += `<option value="${pais.nome_pais_origem}">${pais.nome_pais_origem}</option>`;
        });
    });
}

function renderizarOptionsAnos() {
    fetch("/usuarios/anos", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((anos) => {
        const select = document.getElementById("ano-referencia");
        anos.forEach(ano => {
            select.innerHTML += `<option value="${ano.ano}">${ano.ano}</option>`;
        });
    });
}

function limparCamposFiltro() {
    document.getElementById("nome-filtro").value  = "";
    document.getElementById("mes-inicio").value   = "";
    document.getElementById("mes-final").value    = "";
    estadosSelecionados = [];
    paisesSelecionados  = [];
    renderizarEstados();
    renderizarPaises();

    chkNomeFiltro = false;
    chkMesInicio  = false;
    chkMesFinal   = false;
    chkAno        = false;
}

function editarFiltro(idFiltro) {
    sessionStorage.setItem("ID_FILTRO", idFiltro);
    window.location.href = "../../../usuario/editar-filtro.html";
}

renderizarOptionsEstados();
renderizarOptionsPaises();
renderizarOptionsAnos();
carregarFiltros();
