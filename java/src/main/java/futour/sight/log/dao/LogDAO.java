package futour.sight.log.dao;

import futour.sight.dao.BaseDAO;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogDAO extends BaseDAO {

    public LogDAO(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public void inserir(String tabela, int registrosLidos, boolean sucesso, String mensagem) {
        String sql = """
                INSERT INTO log (tabela, registros_lidos, sucesso, mensagem)
                VALUES (?, ?, ?, ?)
                """;
        jdbc.update(sql, tabela, registrosLidos, sucesso, mensagem);
    }
}