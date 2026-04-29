function salvarFiltro() {
    const nomeFiltro = document.getElementById('nome-filtro').value;
    const mes_inicio = document.getElementById('mes-inicio').value;
    const mes_final = document.getElementById('mes-final').value;
    const ano = document.getElementById('ano-referencia').value;
    
    fetch(`/usuarios/criarFiltro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeFiltro: nomeFiltro,
            estados: estadosSelecionados,
            paises: paisesSelecionados,
            mes_inicio: mes_inicio,
            mes_fim: mes_final,
            ano: ano,
            fkUsuario: sessionStorage.ID_USUARIO
        }),
    })
    .then(() => {
        carregarFiltros();
    })
}

let estadosSelecionados = [];

function adicionarEstado() {
    const select = document.getElementById("estado-destino");
    const valor = select.value;
    const texto = select.options[select.selectedIndex].text;

    if (!valor) return;

    // Evita duplicados
    if (!estadosSelecionados.includes(texto)) {
        estadosSelecionados.push(texto);
        renderizarEstados();
    }

    // Reseta o select
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

let paisesSelecionados = [];

function adicionarPais() {
    const select = document.getElementById("pais-origem");
    const valor = select.value;
    const texto = select.options[select.selectedIndex].text;

    if (!valor) return;

    // Evita duplicados
    if (!paisesSelecionados.includes(texto)) {
        paisesSelecionados.push(texto);
        renderizarPaises();
    }

    // Reseta o select
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
    const ul_filtros = document.getElementById("ul_filtros");
    const p_quantidade_filtros = document.getElementById("pQuantidadeFiltros");
    const idUsuario = sessionStorage.ID_USUARIO;

    fetch(`/usuarios/listarFiltros?idUsuario=${idUsuario}`, {
        method: "GET",
    })
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro na resposta do servidor")
            return resposta.json()
        })
        .then((filtros) => {
            if(filtros.length == 0) {
                p_quantidade_filtros.innerHTML = "0 filtros salvos"
            } else if (filtros.length == 1) {
                p_quantidade_filtros.innerHTML = "1 filtro salvo"
            } else {
                p_quantidade_filtros.innerHTML = `${filtros.length} filtros salvos`
            }

            ul_filtros.innerHTML = "";

            filtros.forEach(filtro => {
                const primeirosEstados = filtro.estados.slice(0, 3);
                const restanteEstados = filtro.estados.length - 3;

                let stringEstados = primeirosEstados.join(", ");

                if (restanteEstados > 0) {
                    stringEstados += ` +${restanteEstados}`;
                }

                const primeirosPaises = filtro.paises.slice(0, 1);
                const restantePaises = filtro.paises.length - 1;

                let stringPaises = primeirosPaises.join(", ");

                if (restantePaises > 0) {
                    stringPaises += ` +${restantePaises}`;
                }

                const stringInfoFiltro = stringEstados + `${stringPaises != "" ? " - " + stringPaises : ""}`

                ul_filtros.innerHTML += `
                    <li class="filtro">
                        <div class="infos-filtro-container">
                            <div class="icone-filtro">
                                <!-- Pegar primeira letra do nome do filtro -->
                                <span>${filtro.nome[0]}</span>
                            </div>

                            <div class="infos-filtro">
                                <h4>${filtro.nome}</h4>
                                <p>${stringInfoFiltro} </p>
                            </div>
                        </div>

                        <div class="botoes">
                            <button onclick="editarFiltro(${filtro.id})">Editar</button>
                            <button onclick="excluirFiltro(${filtro.id})">Excluir</button>
                        </div>
                    </li>
                `
            });
        })
        .catch((erro) => {
            console.error("#ERRO:", erro)
        })
}

carregarFiltros()