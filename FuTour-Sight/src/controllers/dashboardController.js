const model = require('../models/dashboardModel');

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function calcularCrescimento(atual, anterior) {
    if (!anterior) return 100;
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
    return Object.keys(fim)
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

function topVolume(fim, n = 3) {
    return Object.entries(fim)
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, n);
}

function kpiDeficit(inicio, fim) {
    return Object.keys({ ...inicio, ...fim })
        .map(k => ({
            nome: k,
            diferenca: (fim[k] || 0) - (inicio[k] || 0),
            crescimento: calcularCrescimento(fim[k] || 0, inicio[k] || 0)
        }))
        .filter(k => k.diferenca < 0)
        .sort((a, b) => a.diferenca - b.diferenca)[0] || null;
}

function totalPorMes(rows, ano) {
    const totais = {};
    for (const r of rows) {
        if (r.ano == ano) {
            totais[r.mes] = (totais[r.mes] || 0) + Number(r.total);
        }
    }
    return MESES.map(mes => totais[mes] || 0);
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
        const { inicio: viaI, fim: viaF }   = separarPorAno(vias, filtro.ano_inicio, filtro.ano_fim);

        const kpiMes  = topCrescimento(mesI, mesF, 1)[0];
        const kpiPais = topCrescimento(paisI, paisF, 1)[0];
        const kpiVia  = topCrescimento(viaI, viaF, 1)[0];

        const totalInicio = Object.values(mesI).reduce((a, b) => a + b, 0);
        const totalFim    = Object.values(mesF).reduce((a, b) => a + b, 0);
        const kpiDeficitMes = kpiDeficit(mesI, mesF);

        const top3Crescimento = topCrescimento(paisI, paisF, 3);

        const top3Volume  = topVolume(paisF, 3);
        const nomesVolume = top3Volume.map(p => p.nome);

        const [fluxo, viaTop3] = await Promise.all([
            model.getFluxoMensalPorPais(filtro, nomesVolume),
            model.getTotaisPorVia(filtro, nomesVolume)
        ]);

        const { fim: viaTop3F } = separarPorAno(viaTop3, filtro.ano_inicio, filtro.ano_fim);
        const totalViaTop3 = Object.values(viaTop3F).reduce((a, b) => a + b, 0);

        const graficoLinhaMarketing = nomesVolume.map(pais => ({
    pais,
    dados: MESES.map(mes => {
        const total = [filtro.ano_inicio, filtro.ano_fim].reduce((acc, ano) => {
            const r = fluxo.find(f => f.nome_pais_origem === pais && f.mes === mes && f.ano == ano);
            return acc + (r ? Number(r.total) : 0);
        }, 0);
        return total;
    })
}));

        const graficoLinhaGerente = [
            { ano: filtro.ano_inicio, dados: totalPorMes(mensal, filtro.ano_inicio) },
            { ano: filtro.ano_fim,    dados: totalPorMes(mensal, filtro.ano_fim) }
        ];

        const graficoDoughnut = Object.entries(viaTop3F).map(([via, total]) => ({
            via,
            total,
            percentual: parseFloat((total * 100 / totalViaTop3).toFixed(1))
        })).sort((a, b) => b.total - a.total);

        return res.json({
            filtro: {
                nome: filtro.nome,
                estado: filtro.estado,
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
                },
                taxa_crescimento_geral: {
                    crescimento_percentual: calcularCrescimento(totalFim, totalInicio),
                    diferenca_turistas: totalFim - totalInicio
                },
                mes_maior_deficit: kpiDeficitMes ? {
                    mes: kpiDeficitMes.nome,
                    crescimento_percentual: kpiDeficitMes.crescimento,
                    diferenca_turistas: kpiDeficitMes.diferenca
                } : null
            },
            grafico_linha_marketing: {
                meses: MESES,
                series: graficoLinhaMarketing
            },
            grafico_linha_gerente: {
                meses: MESES,
                series: graficoLinhaGerente
            },
            ranking_paises: top3Crescimento.map((p, i) => ({
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