verificarNivel("EMPRESA_ADMIN", "EMPRESA_USER");

preencherNomeUsuario();

var chkNomeFiltro = false;
var chkEstado     = false;
var chkContinente = false;
var chkAno        = false;

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
    } else {
        document.getElementById("div_msg_estado").innerHTML = "";
        chkEstado = true;
    }
}

function onkey_continente() {
    var erro = validarContinente(document.getElementById("continente-origem").value.trim());

    if (erro != "") {
        document.getElementById("div_msg_continente").innerHTML = erro;
        chkContinente = false;
    } else {
        document.getElementById("div_msg_continente").innerHTML = "";
        chkContinente = true;
    }
}

function onkey_ano() {
    var erroAnoInicio = validarAno(document.getElementById("ano-inicio").value);
    var erroAnoFim    = validarAno(document.getElementById("ano-fim").value);

    document.getElementById("div_msg_ano").innerHTML = "";

    if (erroAnoInicio != "") {
        document.getElementById("div_msg_ano").innerHTML += erroAnoInicio + "<br>";
        chkAno = false;
    }

    if (erroAnoFim != "") {
        document.getElementById("div_msg_ano").innerHTML += erroAnoFim;
        chkAno = false;
    }

    if (erroAnoInicio == "" && erroAnoFim == "") {
        chkAno = true;
    }
}

function buscarFiltro() {
    fetch(`/usuarios/filtros/${sessionStorage.getItem("ID_FILTRO")}`, { method: "GET" })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((filtros) => {
            const filtro = filtros[0];

            setTimeout(() => {
                document.getElementById("nome-filtro").value        = filtro.nome;
                document.getElementById("estado-destino").value     = filtro.estado;
                document.getElementById("continente-origem").value  = filtro.continente;
                document.getElementById("ano-inicio").value         = filtro.ano_inicio;
                document.getElementById("ano-fim").value            = filtro.ano_fim;
            }, 10);

            chkNomeFiltro = true;
            chkEstado     = true;
            chkContinente = true;
            chkAno        = true;
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao carregar filtro");
        });
}

function renderizarOptionsEstados() {
    fetch("/usuarios/estados", { method: "GET" })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((estados) => {
            const select = document.getElementById("estado-destino");
            estados.forEach(estado => {
                select.innerHTML += `<option value="${estado.uf}">${estado.uf}</option>`;
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao carregar estados");
        });
}

function renderizarOptionsContinentes() {
    fetch("/usuarios/continentes", { method: "GET" })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((continentes) => {
            const select = document.getElementById("continente-origem");
            continentes.forEach(continente => {
                select.innerHTML += `<option value="${continente.continente}">${continente.continente}</option>`;
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao carregar continentes");
        });
}

function renderizarOptionsAnos() {
    fetch("/usuarios/anos", { method: "GET" })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then((anos) => {
            const selects = document.querySelectorAll(".select-anos-comparacao");
            anos.forEach(ano => {
                selects.forEach(select => {
                    select.innerHTML += `<option value="${ano.ano}">${ano.ano}</option>`;
                });
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao carregar anos");
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
    const estado     = document.getElementById("estado-destino").value;
    const continente = document.getElementById("continente-origem").value;
    const ano_inicio = document.getElementById("ano-inicio").value;
    const ano_fim    = document.getElementById("ano-fim").value;

    fetch(`/usuarios/filtros/${sessionStorage.getItem("ID_FILTRO")}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeFiltro: nomeFiltro,
            estado:     estado,
            continente: continente,
            ano_inicio: ano_inicio,
            ano_fim:    ano_fim,
            fkUsuario:  sessionStorage.getItem("ID_USUARIO")
        }),
    })
        .then((resposta) => tratarRespostaFetch(resposta))
        .then(() => {
            ativarToast("sucesso", "Filtro atualizado com sucesso!");
            window.location.href = "../../../usuario/filtros.html";
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
