const model = require('../models/dashboardModel');

const MESES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function calcularCrescimento(atual, anterior) {
    if (!anterior) return null;
    return parseFloat((((atual - anterior) / anterior) * 100).toFixed(1));
}

function separarPorAno(rows, anoInicio, anoFim) {
    const i = {}, f = {};
    for (const r of rows) {
        const chave = r.nome_pais_origem || r.mes || r.via_de_acesso;
        if (r.ano == anoInicio) i[chave] = Number(r.total);
        if (r.ano == anoFim)   f[chave] = Number(r.total);
    }
    return { inicio: i, fim: f };
}

function topCrescimento(inicio, fim, n = 3) {
    const chaves = Object.keys(fim);
    return chaves
        .map(k => ({
            nome: k,
            totalInicio: inicio[k] || 0,
            totalFim: fim[k] || 0,
            diferenca: (fim[k] || 0) - (inicio[k] || 0),
            crescimento: calcularCrescimento(fim[k] || 0, inicio[k] || 0)
        }))
        .sort((a, b) => b.diferenca - a.diferenca)
        .slice(0, n);
}

async function getDashboard(req, res) {
    try {
        const { idFiltro } = req.params;

        const filtro = await model.buscarFiltro(idFiltro);
        if (!filtro) return res.status(404).json({ erro: 'Filtro não encontrado' });

        const [mensal, paises, vias] = await Promise.all([
            model.getTotaisMensais(filtro),
            model.getTotaisPorPais(filtro),
            model.getTotaisPorVia(filtro)
        ]);

        const { inicio: mesI, fim: mesF } = separarPorAno(mensal, filtro.ano_inicio, filtro.ano_fim);
        const { inicio: paisI, fim: paisF } = separarPorAno(paises, filtro.ano_inicio, filtro.ano_fim);
        const { inicio: viaI, fim: viaF } = separarPorAno(vias, filtro.ano_inicio, filtro.ano_fim);

        const kpiMes = topCrescimento(mesI, mesF, 1)[0];
        const kpiPais = topCrescimento(paisI, paisF, 1)[0];
        const kpiVia = topCrescimento(viaI, viaF, 1)[0];

        const top3Paises = topCrescimento(paisI, paisF, 3);
        const nomesPaises = top3Paises.map(p => p.nome);

        const [fluxo, viaTop3] = await Promise.all([
            model.getFluxoMensalPorPais(filtro, nomesPaises),
            model.getTotaisPorVia(filtro, nomesPaises)
        ]);

        const { fim: viaTop3F, inicio: viaTop3I } = separarPorAno(viaTop3, filtro.ano_inicio, filtro.ano_fim);
        const totalViaTop3 = Object.values(viaTop3F).reduce((a, b) => a + b, 0);

        const graficoLinha = nomesPaises.map(pais => ({
            pais,
            dados: MESES.map(mes => {
                const r = fluxo.find(f => f.nome_pais_origem === pais && f.mes === mes && f.ano == filtro.ano_fim);
                return r ? Number(r.total) : 0;
            })
        }));

        const graficoDoughnut = Object.entries(viaTop3F).map(([via, total]) => ({
            via,
            total,
            percentual: parseFloat((total * 100 / totalViaTop3).toFixed(1))
        })).sort((a, b) => b.total - a.total);

        return res.json({
            filtro: {
                nome: filtro.nome,
                uf: filtro.uf,
                continente: filtro.continente,
                ano_inicio: filtro.ano_inicio,
                ano_fim: filtro.ano_fim
            },
            kpis: {
                mes_maior_crescimento: {
                    mes: kpiMes?.nome,
                    crescimento_percentual: kpiMes?.crescimento,
                    diferenca_turistas: kpiMes?.diferenca
                },
                pais_maior_crescimento: {
                    pais: kpiPais?.nome,
                    crescimento_percentual: kpiPais?.crescimento,
                    diferenca_turistas: kpiPais?.diferenca
                },
                via_maior_crescimento: {
                    via: kpiVia?.nome,
                    crescimento_percentual: kpiVia?.crescimento,
                    diferenca_chegadas: kpiVia?.diferenca
                }
            },
            grafico_linha: {
                meses: MESES,
                series: graficoLinha
            },
            ranking_paises: top3Paises.map((p, i) => ({
                posicao: i + 1,
                pais: p.nome,
                total_ano_inicio: p.totalInicio,
                total_ano_fim: p.totalFim,
                diferenca: p.diferenca,
                crescimento_percentual: p.crescimento
            })),
            grafico_doughnut: graficoDoughnut
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao gerar dashboard' });
    }
}

module.exports = { getDashboard };