const model = require('../models/dashboardModel');

const MESES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

const MAPA_MESES = {
    'janeiro': 'Janeiro',
    'fevereiro': 'Fevereiro',
    'marco': 'Março',
    'março': 'Março',
    'abril': 'Abril',
    'maio': 'Maio',
    'junho': 'Junho',
    'julho': 'Julho',
    'agosto': 'Agosto',
    'setembro': 'Setembro',
    'outubro': 'Outubro',
    'novembro': 'Novembro',
    'dezembro': 'Dezembro'
};

function normalizarMes(mes) {
    if (!mes) return '';
    return MAPA_MESES[mes.toLowerCase()] || mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
}

function calcularCrescimento(atual, anterior) {
    if (!anterior || anterior === 0) return 100;
    return parseFloat((((atual - anterior) / anterior) * 100).toFixed(1));
}

function separarPorAno(rows, anoInicio, anoFim) {
    const inicio = {};
    const fim = {};

    for (const r of rows) {
        const chave =
            r.nome_pais_origem ||
            r.via_de_acesso ||
            normalizarMes(r.mes);

        if (r.ano == anoInicio) inicio[chave] = Number(r.total);
        if (r.ano == anoFim) fim[chave] = Number(r.total);
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

        if (!filtro) {
            return res.status(404).json({ erro: 'Filtro não encontrado' });
        }

        const totaisMensais = await model.getTotaisMensais(filtro);
        const totaisPorPais = await model.getTotaisPorPais(filtro);

        const { inicio, fim } = separarPorAno(
            totaisPorPais,
            filtro.ano_inicio,
            filtro.ano_fim
        );

        const totalInicio = Object.values(inicio).reduce((a, b) => a + b, 0);
        const totalFim = Object.values(fim).reduce((a, b) => a + b, 0);

        const crescimentoTotal = calcularCrescimento(totalFim, totalInicio);
        const diferencaTotal = totalFim - totalInicio;

        const crescimentoPorPais = Object.keys(fim).map(nome => {
            const valorInicio = inicio[nome] || 0;
            const valorFim = fim[nome] || 0;

            return {
                nome,
                inicio: valorInicio,
                fim: valorFim,
                diferenca: valorFim - valorInicio,
                crescimento: calcularCrescimento(valorFim, valorInicio)
            };
        });

        const positivos = crescimentoPorPais
            .filter(p => p.crescimento > 0)
            .sort((a, b) => b.crescimento - a.crescimento);

        const top3 = positivos.length >= 3
            ? positivos.slice(0, 3)
            : crescimentoPorPais
                .sort((a, b) => b.crescimento - a.crescimento)
                .slice(0, 3);

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

        const fluxoMensal = await model.getFluxoMensalPorPais(filtro, nomesTop3);
        const totaisVia = await model.getTotaisPorVia(filtro, nomesTop3);

        const graficoLinhaMarketing = nomesTop3.flatMap(pais =>
            [filtro.ano_inicio, filtro.ano_fim].map(ano => ({
                pais,
                ano,
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

        const graficoDoughnut = (() => {
            const inicioVia = {};
            const fimVia = {};

            for (const r of totaisVia) {
                if (r.ano == filtro.ano_inicio) inicioVia[r.via_de_acesso] = Number(r.total);
                if (r.ano == filtro.ano_fim) fimVia[r.via_de_acesso] = Number(r.total);
            }

            return {
                labels: Object.keys(fimVia),
                datasets: [
                    { ano: filtro.ano_inicio, dados: Object.values(inicioVia) },
                    { ano: filtro.ano_fim, dados: Object.values(fimVia) }
                ]
            };
        })();

        return res.json({
            filtro,
            kpis: {
                crescimento_total: {
                    percentual: crescimentoTotal,
                    diferenca: diferencaTotal
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
                }
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

module.exports = {
    getDashboard
};