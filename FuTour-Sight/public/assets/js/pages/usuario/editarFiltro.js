let estadosSelecionados = [];

function buscarFiltro() {
    fetch(`/usuarios/buscarFiltro/${sessionStorage.ID_FILTRO}`)
        .then((resposta) => {
            resposta.json()
                .then((filtros) => {
                    const filtro = filtros[0];
                    console.log(filtro);
                    estadosSelecionados = filtro.estados.split(",");
                    paisesSelecionados = filtro.paises.split(",");

                    renderizarEstados()
                    renderizarPaises()

                    document.getElementById('nome-filtro').value = filtro.nome;
                    document.getElementById('mes-inicio').value = filtro.mes_inicio;
                    document.getElementById('mes-final').value = filtro.mes_fim;
                    document.getElementById('ano_referencia').value = filtro.ano_referencia;

                })
            
        })
}

buscarFiltro()

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

function renderizarOptionsEstados() {
    fetch("/usuarios/listarEstados", {
        method: "GET"
    })
        .then((resposta) => {
            resposta.json()
                .then((estados) => {
                    const select = document.getElementById("estado-destino");

                    estados.forEach(estado => {
                        select.innerHTML += `
                    <option value="${estado.uf}">${estado.uf}</option>
                `
                    });
                })

        })
}

renderizarOptionsEstados();

function renderizarOptionsPaises() {
    fetch("/usuarios/listarPaises", {
        method: "GET"
    })
        .then((resposta) => {
            resposta.json()
                .then((paises) => {
                    const select = document.getElementById("pais-origem");

                    paises.forEach(pais => {
                        select.innerHTML += `
                    <option value="${pais.nome_pais_origem}">${pais.nome_pais_origem}</option>
                `
                    });
                })

        })
}

renderizarOptionsPaises()

function renderizarOptionsAnos() {
    fetch("/usuarios/listarAnos", {
        method: "GET"
    })
        .then((resposta) => {
            resposta.json()
                .then((anos) => {
                    const select = document.getElementById("ano-referencia");

                    anos.forEach(ano => {
                        select.innerHTML += `
                            <option value="${ano.ano}">${ano.ano}</option>
                        `
                    });
                })

        })
}

renderizarOptionsAnos()

function atualizarFiltro() {
    const nomeFiltro = document.getElementById('nome-filtro').value;
    const mes_inicio = document.getElementById('mes-inicio').value;
    const mes_final = document.getElementById('mes-final').value;
    const ano = document.getElementById('ano-referencia').value;

    fetch(`/usuarios/atualizarFiltro/${sessionStorage.ID_FILTRO}`, {
        method: "PUT",
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
            window.location.href = "../../../usuario/filtros.html"
        })
}

function cancelarAtualizacaoFiltro() {
    window.location.href = "../../../usuario/filtros.html"
}