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
preencherNomeUsuario();

var chkNomeFiltro = false;
var chkEstado = false;
var chkContinente = false;
var chkAno = false;

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

function onkey_estado() {
    var erro = validarEstado(document.getElementById("estado-destino").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_estado").innerHTML = erro;
        chkEstado = false;
        console.log('erro estado');

    } else {
        document.getElementById("div_msg_estado").innerHTML = "";
        chkEstado = true;
    }
}

function onkey_continente() {
    var erro = validarContinente(document.getElementById("continente-origem").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_continente").innerHTML = erro;
        chkcontinente = false;
        console.log('erro continente');

    } else {
        document.getElementById("div_msg_continente").innerHTML = "";
        chkContinente = true;
    }
}

function onkey_ano() {
    var erroAnoInicio = validarAno(document.getElementById("ano-inicio").value);
    var erroAnoFim = validarAno(document.getElementById("ano-fim").value);

    if (erroAnoInicio != "") {
        document.getElementById("div_msg_ano").innerHTML += erroAnoInicio + "<br>";
        chkAno = false;
        console.log('erro ano inicio');

    }

    if (erroAnoFim != "") {
        document.getElementById("div_msg_ano").innerHTML += erroAnoFim;
        chkAno = false;
        console.log('erro ano fim');

    }

    if (erroAnoInicio == "" && erroAnoFim == "") {
        document.getElementById("div_msg_ano").innerHTML = "";
        chkAno = true;
    }
}

function buscarFiltro() {
    fetch(`/usuarios/filtros/${sessionStorage.getItem("ID_FILTRO")}`)
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((filtros) => {
            const filtro = filtros[0];

            setTimeout(() => {
                document.getElementById("nome-filtro").value = filtro.nome;
                document.getElementById("estado-destino").value = filtro.estado;
                document.getElementById("continente-origem").value = filtro.continente;
                document.getElementById("ano-inicio").value = filtro.ano_inicio;
                document.getElementById("ano-fim").value = filtro.ano_fim;
            }, 10)

            var chkNomeFiltro = true;
            var chkEstado = true;
            var chkContinente = true;
            var chkAno = true;
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao carregar filtro");
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

function renderizarOptionsContinentes() {
    fetch("/usuarios/continentes", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((continentes) => {
        const select = document.getElementById("continente-origem");
        continentes.forEach(continente => {
            select.innerHTML += `<option value="${continente.continente}">${continente.continente}</option>`;
        });
    });
}

function renderizarOptionsAnos() {
    fetch("/usuarios/anos", { method: "GET" })
    .then((resposta) => resposta.json())
    .then((anos) => {
        const selects = document.querySelectorAll(".select-anos-comparacao");
        anos.forEach(ano => {
            selects.forEach(select => {
                select.innerHTML += `<option value="${ano.ano}">${ano.ano}</option>`;
            })
        });
    });
}

function atualizarFiltro() {
    onkey_nome_filtro();
    onkey_estado();
    onkey_continente();
    onkey_ano();

    const temErro = chkNomeFiltro && chkEstado && chkContinente && chkAno;

    if (!temErro) {
        exibirToast("erro", "Preencha todos os campos corretamente.");
        return false;
    }

    const nomeFiltro = document.getElementById("nome-filtro").value;
    const estado = document.getElementById("estado-destino").value;
    const continente = document.getElementById("continente-origem").value;
    const ano_inicio = document.getElementById("ano-inicio").value;
    const ano_fim = document.getElementById("ano-fim").value;

    fetch(`/usuarios/filtros/${sessionStorage.getItem("ID_FILTRO")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeFiltro:  nomeFiltro,
            estado:      estado,
            continente:  continente,
            ano_inicio:  ano_inicio,
            ano_fim:     ano_fim,
            fkUsuario:   sessionStorage.getItem("ID_USUARIO")
        }),
    })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then(() => {
            // mostrarToast("Filtro atualizado com sucesso!", "sucesso");
            ativarToast();
            // setTimeout(() => {
            window.location.href = "../../../usuario/filtros.html";
            // }, 1500);
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao atualizar filtro");
        });

    return false;
}

function cancelarAtualizacaoFiltro() {
    window.location.href = "../../../usuario/filtros.html";
}

renderizarOptionsEstados();
renderizarOptionsContinentes();
renderizarOptionsAnos();
buscarFiltro();