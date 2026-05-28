package futour.sight.dao;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

public class EmpresaAdminDAO extends BaseDAO {

    public EmpresaAdminDAO(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public List<Map<String, Object>> getAdminsAtivos() {

        String sql = """
                SELECT u.email, u.nome, e.nome AS empresa
                FROM usuario u
                INNER JOIN nivel_permissao np
                    ON np.id_nivel_permissao = u.fk_nivel_permissao
                INNER JOIN status s
                    ON s.id_status = u.fk_status
                INNER JOIN empresa e
                    ON e.id_empresa = u.fk_empresa
                WHERE np.nome = 'EMPRESA_ADMIN'
                  AND s.nome = 'ATIVO'
                """;

        return jdbc.queryForList(sql);
    }

    public long getTotalChegadas(int ano) {

        String sql = """
                SELECT COALESCE(SUM(chegadas), 0)
                FROM chegadas_turistas
                WHERE ano = ?
                """;

        Long total = jdbc.queryForObject(sql, Long.class, ano);
        return total != null ? total : 0;
    }

    public String getPaisLider(int ano) {

        String sql = """
                SELECT nome_pais_origem
                FROM chegadas_turistas
                WHERE ano = ?
                GROUP BY nome_pais_origem
                ORDER BY SUM(chegadas) DESC
                LIMIT 1
                """;

        try {
            return jdbc.queryForObject(sql, String.class, ano);
        } catch (Exception e) {
            return "N/A";
        }
    }

    public String getMelhorMes(int ano) {

        String sql = """
                SELECT mes
                FROM chegadas_turistas
                WHERE ano = ?
                GROUP BY mes
                ORDER BY SUM(chegadas) DESC
                LIMIT 1
                """;

        try {
            return jdbc.queryForObject(sql, String.class, ano);
        } catch (Exception e) {
            return "N/A";
        }
    }
}