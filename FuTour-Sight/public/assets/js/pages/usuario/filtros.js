function salvarFiltro() {

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