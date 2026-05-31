const model = require('../models/dashboardModel');

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MAPA_MESES = {
    'janeiro': 'Janeiro', 'fevereiro': 'Fevereiro', 'marco': 'Março',
    'março': 'Março', 'abril': 'Abril', 'maio': 'Maio', 'junho': 'Junho',
    'julho': 'Julho', 'agosto': 'Agosto', 'setembro': 'Setembro',
    'outubro': 'Outubro', 'novembro': 'Novembro', 'dezembro': 'Dezembro'
};

const MAPA_VIAS = {
    'aérea': 'Aérea', 'aerea': 'Aérea', 'aéreo': 'Aérea', 'aereo': 'Aérea',
    'terrestre': 'Terrestre',
    'fluvial': 'Marítima',
    'marítima': 'Marítima', 'maritima': 'Marítima', 'marítimo': 'Marítima', 'maritimo': 'Marítima'
};

function normalizarMes(mes) {
    if (!mes) return '';
    return MAPA_MESES[mes.toLowerCase()] || mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
}

function normalizarVia(via) {
    if (!via) return via;
    return MAPA_VIAS[via.toLowerCase()] || via;
}

function calcularCrescimento(atual, anterior) {
    if (!anterior || anterior === 0) return null;
    return parseFloat((((atual - anterior) / anterior) * 100).toFixed(1));
}

function separarPorAno(rows, anoInicio, anoFim, normalizarChave) {
    const inicio = {};
    const fim = {};
    for (const r of rows) {
        let chave = r.nome_pais_origem || r.via_de_acesso || normalizarMes(r.mes);
        if (normalizarChave) chave = normalizarChave(chave);
        if (r.ano == anoInicio) inicio[chave] = (inicio[chave] || 0) + Number(r.total);
        if (r.ano == anoFim) fim[chave] = (fim[chave] || 0) + Number(r.total);
    }
    return { inicio, fim };
}

function totalPorMes(rows, ano) {
    const totais = {};
    for (const r of rows) {
        if (r.ano == ano) {
            const mes = normalizarMes(r.mes);
            totais[mes] = (totais[mes] || 0) + Number(r.total);
        }
    }
    return MESES.map(mes => totais[mes] || 0);
}

async function getDashboard(req, res) {
    try {
        const idFiltro = req.params.idFiltro;
        const filtro = await model.buscarFiltro(idFiltro);
        if (!filtro) return res.status(404).json({ erro: 'Filtro não encontrado' });

        const [totaisMensais, totaisPorPais] = await Promise.all([
            model.getTotaisMensais(filtro),
            model.getTotaisPorPais(filtro)
        ]);

        const { inicio, fim } = separarPorAno(totaisPorPais, filtro.ano_inicio, filtro.ano_fim);

        const totalInicio = Object.values(inicio).reduce((a, b) => a + b, 0);
        const totalFim = Object.values(fim).reduce((a, b) => a + b, 0);

        const crescimentoPorPais = Object.keys(fim).map(nome => ({
            nome,
            inicio: inicio[nome] || 0,
            fim: fim[nome] || 0,
            diferenca: (fim[nome] || 0) - (inicio[nome] || 0),
            crescimento: calcularCrescimento(fim[nome] || 0, inicio[nome] || 0)
        }));

        const positivos = crescimentoPorPais
            .filter(p => p.crescimento > 0)
            .sort((a, b) => b.crescimento - a.crescimento);

        const top3 = positivos.length >= 3
            ? positivos.slice(0, 3)
            : crescimentoPorPais.sort((a, b) => (b.crescimento || 0) - (a.crescimento || 0)).slice(0, 3);

        const paisMaiorCrescimento = top3[0] || null;

        const crescimentoMensal = {};
        for (const mes of MESES) {
            const valorInicio = totaisMensais
                .filter(r => normalizarMes(r.mes) === mes && r.ano == filtro.ano_inicio)
                .reduce((acc, r) => acc + Number(r.total), 0);
            const valorFim = totaisMensais
                .filter(r => normalizarMes(r.mes) === mes && r.ano == filtro.ano_fim)
                .reduce((acc, r) => acc + Number(r.total), 0);
            crescimentoMensal[mes] = {
                inicio: valorInicio,
                fim: valorFim,
                diferenca: valorFim - valorInicio,
                crescimento: calcularCrescimento(valorFim, valorInicio)
            };
        }

        const maiorCrescimento = Object.entries(crescimentoMensal)
            .sort((a, b) => b[1].diferenca - a[1].diferenca)[0];
        const maiorDeficit = Object.entries(crescimentoMensal)
            .sort((a, b) => a[1].diferenca - b[1].diferenca)[0];

        const nomesTop3 = top3.map(p => p.nome);
        const [fluxoMensal, totaisVia] = await Promise.all([
            model.getFluxoMensalPorPais(filtro, nomesTop3),
            model.getTotaisPorVia(filtro, nomesTop3)
        ]);

        const graficoLinhaMarketing = nomesTop3.flatMap(pais =>
            [filtro.ano_inicio, filtro.ano_fim].map(ano => ({
                pais,
                ano,
                tracejado: ano == filtro.ano_inicio,
                dados: MESES.map(mes => {
                    const registro = fluxoMensal.find(f =>
                        f.nome_pais_origem === pais &&
                        normalizarMes(f.mes) === mes &&
                        f.ano == ano
                    );
                    return registro ? Number(registro.total) : 0;
                })
            }))
        );

        const { inicio: inicioVia, fim: fimVia } = separarPorAno(totaisVia, filtro.ano_inicio, filtro.ano_fim, normalizarVia);
        const totalViaFim = Object.values(fimVia).reduce((a, b) => a + b, 0);

        const graficoDoughnut = Object.entries(fimVia)
            .filter(([, total]) => total > 0)
            .map(([via, total]) => ({
                via,
                percentual: totalViaFim > 0 ? parseFloat(((total / totalViaFim) * 100).toFixed(1)) : 0,
                diferenca: total - (inicioVia[via] || 0),
                crescimento: calcularCrescimento(total, inicioVia[via] || 0)
            }));

        const viaMaiorCrescimento = graficoDoughnut
            .filter(v => v.crescimento !== null && v.crescimento > 0)
            .sort((a, b) => b.crescimento - a.crescimento)[0]
            || graficoDoughnut.sort((a, b) => (b.crescimento || 0) - (a.crescimento || 0))[0]
            || null;

        return res.json({
            filtro,
            kpis: {
                crescimento_total: {
                    percentual: calcularCrescimento(totalFim, totalInicio),
                    diferenca: totalFim - totalInicio
                },
                maior_crescimento: {
                    mes: maiorCrescimento[0],
                    percentual: maiorCrescimento[1].crescimento,
                    diferenca: maiorCrescimento[1].diferenca
                },
                maior_deficit: {
                    mes: maiorDeficit[0],
                    percentual: maiorDeficit[1].crescimento,
                    diferenca: maiorDeficit[1].diferenca
                },
                pais_maior_crescimento: paisMaiorCrescimento,
                via_maior_crescimento: viaMaiorCrescimento ? {
                    via: viaMaiorCrescimento.via,
                    percentual: viaMaiorCrescimento.crescimento,
                    diferenca: viaMaiorCrescimento.diferenca
                } : null
            },
            grafico_linha_gerente: {
                meses: MESES,
                datasets: [
                    { ano: filtro.ano_inicio, dados: totalPorMes(totaisMensais, filtro.ano_inicio) },
                    { ano: filtro.ano_fim, dados: totalPorMes(totaisMensais, filtro.ano_fim) }
                ]
            },
            grafico_linha_marketing: {
                meses: MESES,
                series: graficoLinhaMarketing
            },
            ranking_paises: top3,
            grafico_doughnut: graficoDoughnut
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: err.message });
    }
}

module.exports = { getDashboard };
