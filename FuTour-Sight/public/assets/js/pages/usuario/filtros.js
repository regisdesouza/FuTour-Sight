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

function salvarFiltro() {
    onkey_nome_filtro();
    onkey_estado();
    onkey_continente();
    onkey_ano();

    const temErro = chkNomeFiltro && chkEstado && chkContinente && chkAno;

    if (!temErro) {
        exibirToast("erro", "Preencha todos os campos corretamente");
        return false;
    }

    const nomeFiltro = document.getElementById("nome-filtro").value;
    const estado     = document.getElementById("estado-destino").value;
    const continente = document.getElementById("continente-origem").value;
    const ano_inicio = document.getElementById("ano-inicio").value;
    const ano_fim    = document.getElementById("ano-fim").value;

    fetch("/usuarios/filtros", {
        method:  "POST",
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
            exibirToast("sucesso", "Filtro salvo com sucesso!");
            carregarFiltros();
            limparCampos();
        })
        .catch((erro) => {
            console.error("#ERRO:", erro);
            exibirToast("erro", "Erro ao salvar filtro.");
        });

    return false;
}

function carregarFiltros() {
    const ul_filtros           = document.getElementById("ul_filtros");
    const p_quantidade_filtros = document.getElementById("pQuantidadeFiltros");
    const idUsuario            = sessionStorage.getItem("ID_USUARIO");

    fetch(`/usuarios/filtros?idUsuario=${idUsuario}`, { method: "GET" })
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
                const stringInfoFiltro = `${filtro.estado} - ${filtro.continente}`;

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
                            <button onclick="editarFiltro(${filtro.id_filtro})">Editar</button>
                            <button onclick="confirmarExcluirFiltro(${filtro.id_filtro})">Excluir</button>
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
    fetch(`/usuarios/filtros/${idFiltro}`, { method: "DELETE" })
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

function desabilitarOptionsAnosMenoresOuIguais() {
    const select_ano_inicio = document.getElementById("ano-inicio");
    const select_ano_fim = document.getElementById("ano-fim");

    select_ano_inicio.addEventListener("change", () => {
        if(select_ano_inicio.value == "") {
            select_ano_fim.setAttribute("disabled", true);
            select_ano_fim.value = "";
            return;
        } 
    
        select_ano_fim.removeAttribute("disabled");
        
        const options = select_ano_fim.options;
        for (const option of options) {
            if(Number(option.value) <= Number(select_ano_inicio.value) && option.value != "") {
                option.setAttribute("disabled", true);
            } else {
                option.removeAttribute("disabled");
            }
        }
    })
}

function limparCampos() {
    document.getElementById("nome-filtro").value       = "";
    document.getElementById("estado-destino").value    = "";
    document.getElementById("continente-origem").value = "";
    document.getElementById("ano-inicio").value        = "";
    document.getElementById("ano-fim").value           = "";

    chkNomeFiltro = false;
    chkAno        = false;
}

function editarFiltro(idFiltro) {
    sessionStorage.setItem("ID_FILTRO", idFiltro);
    window.location.href = "../../../usuario/editar-filtro.html";
}

renderizarOptionsEstados();
renderizarOptionsContinentes();
renderizarOptionsAnos();
desabilitarOptionsAnosMenoresOuIguais();
carregarFiltros();