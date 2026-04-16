var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao, params = []) {

    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();

        conexao.query(instrucao, params, function (erro, resultados) {
            conexao.end();

            if (erro) {
                reject(erro);
            } else {
                console.log(resultados);
                resolve(resultados);
            }
        });

        conexao.on('error', function (erro) {
            console.log("ERRO NO MySQL:", erro.sqlMessage);
        });
    });
}

module.exports = {
    executar
};