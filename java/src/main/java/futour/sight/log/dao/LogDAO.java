package futour.sight.log.dao;

import futour.sight.dao.BaseDAO;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogDAO extends BaseDAO {

    public LogDAO(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public void inserir(String tabela, String arquivo, int registrosLidos, boolean sucesso, String mensagem) {
        String sql = """
                INSERT INTO log (tabela, arquivo, registros_lidos, sucesso, mensagem)
                VALUES (?, ?, ?, ?, ?)
                """;
        jdbc.update(sql, tabela, arquivo, registrosLidos, sucesso, mensagem);
    }

    public boolean foiProcessado(String arquivo) {
        String sql = """
                SELECT COUNT(*) FROM log WHERE arquivo = ? AND sucesso = 1
                """;
        Integer count = jdbc.queryForObject(sql, Integer.class, arquivo);
        return count != null && count > 0;
    }
}