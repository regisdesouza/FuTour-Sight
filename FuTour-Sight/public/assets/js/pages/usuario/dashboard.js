let chartFluxoGerente = null;
let chartFluxoMarketing = null;
let chartDoughnut = null;

async function renderizarDashboard() {
    const idFiltro = document.getElementById('select-filtros').value;
    if (!idFiltro) return;

    const res = await fetch(`/dashboard/${idFiltro}`);
    const dados = await res.json();

    renderizarParametros(dados.filtro);
    renderizarKpisMarketing(dados.kpis);
    renderizarGraficoLinhaMarketing(dados.grafico_linha);
    renderizarRankingPaises(dados.ranking_paises);
    renderizarDoughnut(dados.grafico_doughnut);
const nivelAcesso = sessionStorage.getItem('NIVEL_ACESSO');

if (nivelAcesso == 3) {
    document.querySelector('.kpis-container.marketing').classList.add('exibindo');
    document.querySelector('.graficos-container.marketing').classList.add('exibindo');
} else {
    document.querySelector('.kpis-container.gerente').classList.add('exibindo');
    document.querySelector('.graficos-container.gerente').classList.add('exibindo');
}
}

function renderizarParametros(filtro) {
    document.getElementById('span-uf').textContent = filtro.uf;
    document.getElementById('span-ano-inicio').textContent = filtro.ano_inicio;
    document.getElementById('span-ano-fim').textContent = filtro.ano_fim;
    document.getElementById('span-continente').textContent = filtro.continente;
}

function renderizarKpisMarketing(kpis) {
    const mes = kpis.mes_maior_crescimento;
    document.getElementById('kpi-mes-valor').textContent = mes.mes;
    document.getElementById('kpi-mes-pct').textContent = `+${mes.crescimento_percentual}%`;
    document.getElementById('kpi-mes-abs').textContent = `+${mes.diferenca_turistas.toLocaleString('pt-BR')} turistas`;

    const pais = kpis.pais_maior_crescimento;
    document.getElementById('kpi-pais-valor').textContent = pais.pais;
    document.getElementById('kpi-pais-pct').textContent = `+${pais.crescimento_percentual}%`;
    document.getElementById('kpi-pais-abs').textContent = `+${pais.diferenca_turistas.toLocaleString('pt-BR')} turistas`;

    const via = kpis.via_maior_crescimento;
    document.getElementById('kpi-via-valor').textContent = via.via;
    document.getElementById('kpi-via-pct').textContent = `+${via.crescimento_percentual}%`;
    document.getElementById('kpi-via-abs').textContent = `+${via.diferenca_chegadas.toLocaleString('pt-BR')} chegadas`;
}

function renderizarGraficoLinhaMarketing(grafico) {
    const ctx = document.getElementById('grafico-fluxo-turistas-marketing');
    const cores = ['#1a3f6f', '#b8860b', '#2e8b57'];

    const datasets = grafico.series.map((serie, i) => ({
        label: serie.pais,
        data: serie.dados,
        borderColor: cores[i],
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3
    }));

    if (chartFluxoMarketing) chartFluxoMarketing.destroy();
    chartFluxoMarketing = new Chart(ctx, {
        type: 'line',
        data: { labels: grafico.meses, datasets },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function renderizarRankingPaises(ranking) {
    const maiorDiferenca = ranking[0]?.diferenca || 1;
    const html = ranking.map((p, i) => `
        <li>
            <div class="pais-header">
                <span>${i + 1}º ${p.pais}</span>
                <div class="pais-dados">
                    <span class="porcentagem">+${p.crescimento_percentual}%</span>
                    <span class="absoluto">+${p.diferenca.toLocaleString('pt-BR')} turistas</span>
                </div>
            </div>
            <div class="barra-porcentagem">
                <div class="barra-porcentagem-atual" style="width: ${Math.round(p.diferenca * 100 / maiorDiferenca)}%"></div>
            </div>
        </li>
    `).join('');

    document.getElementById('ranking-gerente').innerHTML = html;
    document.getElementById('ranking-marketing').innerHTML = html;
}

function renderizarDoughnut(doughnut) {
    const icones = {
        'Aérea': 'aereo.png',
        'Marítima': 'maritimo.png',
        'Terrestre': 'terrestre.png'
    };

    document.getElementById('ranking-via').innerHTML = doughnut.map(d => `
        <li>
            <div class="via-header">
                <span>${d.via}</span>
                <div class="via-dados">
                    <span class="porcentagem">${d.percentual}%</span>
                    <img src="../assets/images/icons/${icones[d.via] || 'aereo.png'}" alt="ícone da via">
                </div>
            </div>
            <div class="barra-porcentagem">
                <div class="barra-porcentagem-atual" style="width: ${d.percentual}%"></div>
            </div>
        </li>
    `).join('');

    if (chartDoughnut) chartDoughnut.destroy();
    chartDoughnut = new Chart(document.getElementById('grafico-principal-via-acesso'), {
        type: 'doughnut',
        data: {
            labels: doughnut.map(d => d.via),
            datasets: [{ data: doughnut.map(d => d.percentual), borderWidth: 1 }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

async function carregarFiltros() {
    const idUsuario = sessionStorage.getItem('ID_USUARIO');
    const res = await fetch(`/usuarios/filtros?idUsuario=${idUsuario}`);
    const filtros = await res.json();

    const select = document.getElementById('select-filtros');
    filtros.forEach(f => {
        const option = document.createElement('option');
        option.value = f.id_filtro;
        option.textContent = f.nome;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('select-filtros').addEventListener('change', renderizarDashboard);
    
    carregarFiltros();
});