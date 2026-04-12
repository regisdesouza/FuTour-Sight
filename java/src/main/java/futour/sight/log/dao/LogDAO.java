package futour.sight.log.dao;

import org.springframework.jdbc.core.JdbcTemplate;

public class LogDAO {

    private JdbcTemplate jdbc;

    public LogDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void inserir(String tabela, int registrosLidos, boolean sucesso, String mensagem) {

        String sql = """
                INSERT INTO log (tabela, registros_lidos, sucesso, mensagem)
                VALUES (?, ?, ?, ?)
                """;

        jdbc.update(sql, tabela, registrosLidos, sucesso, mensagem);
    }
}