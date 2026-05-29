const database = require("../database/config.js");

function buildWhere(filtro) {
    return {
        clause: `
            JOIN vw_continente_turistas vc 
              ON vc.id COLLATE utf8mb4_0900_ai_ci = ct.id COLLATE utf8mb4_0900_ai_ci
            WHERE vc.continente COLLATE utf8mb4_0900_ai_ci = ?
              AND ct.uf COLLATE utf8mb4_0900_ai_ci = ?
              AND ct.ano IN (?, ?)
        `,
        params: [
            filtro.continente,
            filtro.estado,
            filtro.ano_inicio,
            filtro.ano_fim
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
