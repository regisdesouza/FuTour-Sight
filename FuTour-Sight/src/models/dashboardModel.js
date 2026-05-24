const database = require("../database/config.js");

const MESES_NUMERO = {
    'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4,
    'Maio': 5, 'Junho': 6, 'Julho': 7, 'Agosto': 8,
    'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12
};

const PAISES_POR_CONTINENTE = {
    'América do Sul': ['Argentina','Bolívia','Chile','Colômbia','Equador','Guiana','Guiana Francesa','Paraguai','Peru','Suriname','Uruguai','Venezuela'],
    'América do Norte': ['Canadá','Estados Unidos','México'],
    'América Central e Caribe': ['Costa Rica','Cuba','El Salvador','Guatemala','Haiti','Honduras','Nicarágua','Panamá','República Dominicana','Trinidad e Tobago'],
    'Europa': ['Alemanha','Áustria','Bélgica','Bulgária','Croácia','Dinamarca','Eslováquia','Eslovênia','Espanha','Estônia','Finlândia','França','Grécia','Holanda','Hungria','Irlanda','Itália','Letônia','Lituânia','Luxemburgo','Noruega','Polônia','Portugal','Reino Unido','República Tcheca','Romênia','Rússia','Sérvia','Suécia','Suíça','Turquia','Ucrânia'],
    'Ásia': ['Arábia Saudita','Bangladesh','China','China, Hong Kong','Cingapura','Filipinas','Índia','Indonésia','Irã','Israel','Japão','Líbano','Malásia','Paquistão','República da Coreia','Síria','Taiwan','Tailândia'],
    'África': ['África do Sul','Angola','Cabo Verde','Egito','Gana','Quênia','Marrocos','Moçambique','Nigéria','Tunísia'],
    'Oceania': ['Austrália','Nova Zelândia']
};

function getMesesValidos(mesInicio, mesFim) {
    const ini = MESES_NUMERO[mesInicio];
    const fim = MESES_NUMERO[mesFim];
    return Object.entries(MESES_NUMERO)
        .filter(([, n]) => n >= ini && n <= fim)
        .map(([m]) => m);
}

function buildWhere(filtro) {
    const meses = getMesesValidos(filtro.mes_inicio, filtro.mes_fim);
    const paises = PAISES_POR_CONTINENTE[filtro.continente] || [];

    const placeholderMeses  = meses.map(() => '?').join(',');
    const placeholderPaises = paises.map(() => '?').join(',');

    return {
        clause: `
            WHERE ct.uf = ?
              AND ct.ano IN (?, ?)
              AND ct.mes IN (${placeholderMeses})
              AND ct.nome_pais_origem IN (${placeholderPaises})
        `,
        params: [
            filtro.uf,
            filtro.ano_inicio,
            filtro.ano_fim,
            ...meses,
            ...paises
        ]
    };
}

async function buscarFiltro(idFiltro) {
    const rows = await database.executar(
        `SELECT * FROM filtro_personalizado WHERE id_filtro = ?`,
        [idFiltro]
    );
    return rows[0] || null;
}

async function getTotaisMensais(filtro) {
    const { clause, params } = buildWhere(filtro);
    return await database.executar(
        `SELECT ct.mes, ct.ano, SUM(ct.chegadas) AS total
         FROM chegadas_turistas ct
         ${clause}
         GROUP BY ct.ano, ct.mes`,
        params
    );
}

async function getTotaisPorPais(filtro) {
    const { clause, params } = buildWhere(filtro);
    return await database.executar(
        `SELECT ct.nome_pais_origem, ct.ano, SUM(ct.chegadas) AS total
         FROM chegadas_turistas ct
         ${clause}
         GROUP BY ct.nome_pais_origem, ct.ano`,
        params
    );
}

async function getTotaisPorVia(filtro, paises = []) {
    const { clause, params } = buildWhere(filtro);

    let paisFilter = '';
    if (paises.length) {
        paisFilter = `AND ct.nome_pais_origem IN (${paises.map(() => '?').join(',')})`;
        params.push(...paises);
    }

    return await database.executar(
        `SELECT ct.via_de_acesso, ct.ano, SUM(ct.chegadas) AS total
         FROM chegadas_turistas ct
         ${clause}
         ${paisFilter}
         GROUP BY ct.via_de_acesso, ct.ano`,
        params
    );
}

async function getFluxoMensalPorPais(filtro, paises) {
    const { clause, params } = buildWhere(filtro);
    params.push(...paises);

    return await database.executar(
        `SELECT ct.nome_pais_origem, ct.mes, ct.ano, SUM(ct.chegadas) AS total
         FROM chegadas_turistas ct
         ${clause}
         AND ct.nome_pais_origem IN (${paises.map(() => '?').join(',')})
         GROUP BY ct.nome_pais_origem, ct.ano, ct.mes`,
        params
    );
}

module.exports = {
    buscarFiltro,
    getTotaisMensais,
    getTotaisPorPais,
    getTotaisPorVia,
    getFluxoMensalPorPais
};