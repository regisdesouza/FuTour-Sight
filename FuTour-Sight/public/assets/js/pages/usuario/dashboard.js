let chartFluxoGerente = null;
let chartFluxoMarketing = null;
let chartDoughnut = null;

async function renderizarDashboard() {
  const idFiltro = document.getElementById("select-filtros").value;
  if (!idFiltro) return;
  document
    .querySelectorAll(".kpis-container, .graficos-container")
    .forEach((el) => el.classList.remove("exibindo"));
  try {
    const res = await fetch(`/dashboard/${idFiltro}`);
    const dados = await res.json();
    console.log("DADOS DASHBOARD:", dados);
    const nivelAcesso = sessionStorage.getItem("NIVEL_ACESSO");
    renderizarParametros(dados.filtro || {});
    if (nivelAcesso === "EMPRESA_USER") {
      renderizarKpisMarketing(dados.kpis || {});
      renderizarGraficoLinhaMarketing(
        dados.grafico_linha_marketing || { meses: [], series: [] },
      );
      renderizarRankingPaises(dados.ranking_paises || []);
      renderizarDoughnut(dados.grafico_doughnut || []);
      document
        .querySelector(".kpis-container.marketing")
        .classList.add("exibindo");
      document
        .querySelector(".graficos-container.marketing")
        .classList.add("exibindo");
    } else {
      renderizarKpisGerente(dados.kpis || {});
      renderizarGraficoLinhaGerente(
        dados.grafico_linha_gerente || { meses: [], datasets: [] },
      );
      renderizarRankingPaises(dados.ranking_paises || []);
      document
        .querySelector(".kpis-container.gerente")
        .classList.add("exibindo");
      document
        .querySelector(".graficos-container.gerente")
        .classList.add("exibindo");
    }
  } catch (erro) {
    console.error("Erro ao renderizar dashboard:", erro);
  }
}

function renderizarParametros(filtro) {
  document.getElementById("span-uf").textContent = filtro.estado || "—";
  document.getElementById("span-ano-inicio").textContent =
    filtro.ano_inicio || "—";
  document.getElementById("span-ano-fim").textContent = filtro.ano_fim || "—";
  document.getElementById("span-continente").textContent =
    filtro.continente || "—";
}

function aplicarPorcentagem(elPct, valor) {
  const span = document.getElementById(elPct);
  if (!span) return;
  if (valor != null) {
    span.textContent = `${valor >= 0 ? "+" : ""}${valor}%`;
    span.className = "porcentagem " + (valor >= 0 ? "positivo" : "negativo");
  } else {
    span.textContent = "—";
    span.className = "porcentagem";
  }
}

function renderizarKpisMarketing(kpis) {
  const mes = kpis.maior_crescimento || {};
  document.getElementById("kpi-mes-valor").textContent = mes.mes || "—";
  aplicarPorcentagem("kpi-mes-pct", mes.percentual);
  document.getElementById("kpi-mes-abs").textContent =
    mes.diferenca != null
      ? `${mes.diferenca >= 0 ? "+" : ""}${Number(mes.diferenca).toLocaleString("pt-BR")} turistas`
      : "—";

  const pais = kpis.pais_maior_crescimento || {};
  document.getElementById("kpi-pais-valor").textContent = pais.nome || "—";
  aplicarPorcentagem("kpi-pais-pct", pais.crescimento);
  document.getElementById("kpi-pais-abs").textContent =
    pais.diferenca != null
      ? `${pais.diferenca >= 0 ? "+" : ""}${Number(pais.diferenca).toLocaleString("pt-BR")} turistas`
      : "—";

  const via = kpis.via_maior_crescimento || {};
  document.getElementById("kpi-via-valor").textContent = via.via || "—";
  aplicarPorcentagem("kpi-via-pct", via.percentual);
  document.getElementById("kpi-via-abs").textContent =
    via.diferenca != null
      ? `${via.diferenca >= 0 ? "+" : ""}${Number(via.diferenca).toLocaleString("pt-BR")} chegadas`
      : "—";
}

function renderizarKpisGerente(kpis) {
  const taxa = kpis.crescimento_total || {};
  aplicarPorcentagem("kpi-taxa-pct", taxa.percentual);
  document.getElementById("kpi-taxa-abs").textContent =
    taxa.diferenca != null
      ? `${taxa.diferenca >= 0 ? "+" : ""}${Number(taxa.diferenca).toLocaleString("pt-BR")} turistas`
      : "—";

  const mes = kpis.maior_crescimento || {};
  document.getElementById("kpi-gerente-mes-valor").textContent = mes.mes || "—";
  aplicarPorcentagem("kpi-gerente-mes-pct", mes.percentual);
  document.getElementById("kpi-gerente-mes-abs").textContent =
    mes.diferenca != null
      ? `${mes.diferenca >= 0 ? "+" : ""}${Number(mes.diferenca).toLocaleString("pt-BR")} turistas`
      : "—";

  const deficit = kpis.maior_deficit || {};
  document.getElementById("kpi-deficit-valor").textContent = deficit.mes || "—";
  aplicarPorcentagem("kpi-deficit-pct", deficit.percentual);
  document.getElementById("kpi-deficit-abs").textContent =
    deficit.diferenca != null
      ? `${deficit.diferenca >= 0 ? "+" : ""}${Number(deficit.diferenca).toLocaleString("pt-BR")} turistas`
      : "—";
}

function renderizarLegenda(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
        <div class="grafico-legenda-item" style="color:${item.cor}">
            <div class="grafico-legenda-linha${item.tracejado ? " tracejado" : ""}"
                style="background-color:${item.tracejado ? "transparent" : item.cor}; color:${item.cor}">
            </div>
            ${item.label}
        </div>
    `,
    )
    .join("");
}

function renderizarGraficoLinhaMarketing(grafico) {
  const ctx = document.getElementById("grafico-fluxo-turistas-marketing");
  if (!grafico.series || !grafico.series.length) return;

  const coresPais = ["#1a3f6f", "#b8860b", "#2e8b57"];

  const anos = [...new Set(grafico.series.map((s) => s.ano))];

  let anoSelecionado = anos[anos.length - 1];

  function montarDatasets(ano) {
    return grafico.series
      .filter((serie) => serie.ano == ano)
      .map((serie, i) => ({
        label: serie.pais,
        data: serie.dados || [],
        borderColor: coresPais[i],
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: coresPais[i],
      }));
  }

  if (chartFluxoMarketing) {
    chartFluxoMarketing.data.labels = grafico.meses || [];
    chartFluxoMarketing.data.datasets = montarDatasets(anoSelecionado);
    chartFluxoMarketing.update();
  } else {
    chartFluxoMarketing = new Chart(ctx, {
      type: "line",
      data: {
        labels: grafico.meses || [],
        datasets: montarDatasets(anoSelecionado),
      },
      options: {
        plugins: { legend: { display: false } },
        layout: {
          padding: { bottom: 10 },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            grace: "5%",
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    });
  }

  const paisesUnicos = [...new Set(grafico.series.map((s) => s.pais))];
  renderizarLegenda(
    "legenda-marketing",
    paisesUnicos.map((pais, i) => ({
      label: pais,
      cor: coresPais[i],
      tracejado: false,
    })),
  );

  const containerBotoes = document.getElementById("botoes-ano-marketing");
  containerBotoes.innerHTML = anos
    .map(
      (ano) => `
        <button
            class="botao-ano ${ano == anoSelecionado ? "ativo" : ""}"
            onclick="trocarAnoMarketing(${ano}, this)">
            ${ano}
        </button>
    `,
    )
    .join("");

  chartFluxoMarketing._series = grafico.series;
  chartFluxoMarketing._coresPais = coresPais;
}

function trocarAnoMarketing(ano, botaoClicado) {
  document
    .querySelectorAll("#botoes-ano-marketing .botao-ano")
    .forEach((btn) => btn.classList.remove("ativo"));
  botaoClicado.classList.add("ativo");

  const series = chartFluxoMarketing._series;
  const cores = chartFluxoMarketing._coresPais;

  chartFluxoMarketing.data.datasets = series
    .filter((s) => s.ano == ano)
    .map((serie, i) => ({
      label: serie.pais,
      data: serie.dados || [],
      borderColor: cores[i],
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: cores[i],
    }));

  chartFluxoMarketing.update();
}
function renderizarGraficoLinhaGerente(grafico) {
    const ctx = document.getElementById('grafico-fluxo-turistas-gerente');
    if (!grafico.datasets) return;

    const cores = ['#1a3f6f', '#b8860b'];

    const datasets = grafico.datasets.map((serie, i) => ({
        label: String(serie.ano || `Serie ${i + 1}`),
        data: serie.dados || [],
        borderColor: cores[i % cores.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: cores[i % cores.length]
    }));

    if (chartFluxoGerente) {
        chartFluxoGerente.data.labels = grafico.meses || [];
        chartFluxoGerente.data.datasets = datasets;
        chartFluxoGerente.update();
    } else {
        chartFluxoGerente = new Chart(ctx, {
            type: 'line',
            data: { labels: grafico.meses || [], datasets },
            options: {
                plugins: { legend: { display: false } },
                layout: { padding: { bottom: 10 } },
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        grace: '5%',
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { size: 11 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    }
                }
            }
        });
    }

    renderizarLegenda('legenda-gerente', grafico.datasets.map((serie, i) => ({
        label: String(serie.ano || `Serie ${i + 1}`),
        cor: cores[i % cores.length],
        tracejado: false
    })));
}


function renderizarRankingPaises(ranking) {
  if (!ranking || ranking.length === 0) {
    document.getElementById("ranking-gerente").innerHTML =
      "<li>Nenhum dado encontrado</li>";
    document.getElementById("ranking-marketing").innerHTML =
      "<li>Nenhum dado encontrado</li>";
    return;
  }

  const maiorPercentual = Math.max(
    ...ranking.map((p) => Math.abs(Number(p.crescimento) || 0)),
    1,
  );

  const html = ranking
    .map((p, i) => {
      const diferenca = Number(p.diferenca) || 0;
      const percentual = Number(p.crescimento) || 0;
      const largura = Math.max(
        5,
        Math.round((Math.abs(percentual) * 100) / maiorPercentual),
      );
      return `
        <li>
            <div class="pais-header">
                <span>${i + 1}° ${p.nome}</span>
                <div class="pais-dados">
                    <span class="porcentagem ${percentual >= 0 ? "positivo" : "negativo"}">
                        ${percentual >= 0 ? "+" : ""}${percentual}%
                    </span>
                    <span class="absoluto">
                        ${diferenca >= 0 ? "+" : ""}${diferenca.toLocaleString("pt-BR")} turistas
                    </span>
                </div>
            </div>
            <div class="barra-porcentagem">
                <div class="barra-porcentagem-atual" style="width:${largura}%"></div>
            </div>
        </li>`;
    })
    .join("");

  document.getElementById("ranking-gerente").innerHTML = html;
  document.getElementById("ranking-marketing").innerHTML = html;
}

function renderizarDoughnut(doughnut) {
  if (!Array.isArray(doughnut)) return;

  const cores = ["#1C4AA6", "#7D8C0D", "#BF7C2A"];

  const icones = {
    Aérea: "aereo.png",
    Marítima: "maritimo.png",
    Terrestre: "terrestre.png",
  };

  document.getElementById("ranking-via").innerHTML = doughnut
    .map(
      (d, i) => `
        <li>
            <div class="via-header">
                <span>${d.via}</span>
                <div class="via-dados">
                    <span class="porcentagem ${d.percentual >= 0 ? "positivo" : "negativo"}">
                        ${d.percentual}%
                    </span>
                    <img src="../assets/images/icons/${icones[d.via] || "aereo.png"}" alt="icone">
                </div>
            </div>
            <div class="barra-porcentagem">
                <div class="barra-porcentagem-atual" style="width:${d.percentual}%; background-color: ${cores[i]}"></div>
            </div>
        </li>
    `,
    )
    .join("");

  if (chartDoughnut) {
    chartDoughnut.data.labels = doughnut.map((d) => d.via);
    chartDoughnut.data.datasets[0].data = doughnut.map((d) => d.percentual);
    chartDoughnut.update();
  } else {
    chartDoughnut = new Chart(
      document.getElementById("grafico-principal-via-acesso"),
      {
        type: "doughnut",
        data: {
          labels: doughnut.map((d) => d.via),
          datasets: [
            { 
              data: doughnut.map((d) => d.percentual), 
              borderWidth: 1,
              backgroundColor: cores
            },
          ],
        },
        options: { plugins: { legend: { display: false } } },
      },
    );
  }
}

async function carregarFiltros() {
  try {
    const idUsuario = sessionStorage.getItem("ID_USUARIO");
    const res = await fetch(`/usuarios/filtros?idUsuario=${idUsuario}`);
    const filtros = await res.json();

    const select = document.getElementById("select-filtros");

    select.innerHTML = "";

    filtros
      .sort((a, b) => a.nome.localeCompare("pt-BR"))
      .forEach((f) => {
        const option = document.createElement("option");
        option.value = f.id_filtro;
        option.textContent = f.nome;
        select.appendChild(option);
      });

    if (filtros.length > 0) {
      select.value = select.options[0].value;
      renderizarDashboard();
    }
  } catch (erro) {
    console.error("Erro ao carregar filtros:", erro);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("select-filtros")
    .addEventListener("change", renderizarDashboard);
  carregarFiltros();
});

preencherNomeUsuario();
