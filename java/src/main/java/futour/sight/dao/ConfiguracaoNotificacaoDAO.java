package futour.sight.dao;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class ConfiguracaoNotificacaoDAO extends BaseDAO {

    public ConfiguracaoNotificacaoDAO(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public boolean isAtivo(String tipo) {

        String sql = """
            SELECT ativo
            FROM configuracao_notificacao
            WHERE tipo = ?
            LIMIT 1
        """;

        Boolean ativo = jdbc.queryForObject(
                sql,
                Boolean.class,
                tipo
        );

        return ativo != null && ativo;
    }

    public List<String> getDestinatariosAtivos(String tipo) {

        String sql = """
        SELECT u.slack_id
        FROM usuario u
        INNER JOIN usuario_notificacao un
            ON un.fk_usuario = u.id_usuario
        INNER JOIN configuracao_notificacao cn
            ON cn.id_configuracao_notificacao = un.fk_configuracao_notificacao
        WHERE cn.tipo = ?
          AND cn.ativo = true
          AND un.receber = true
          AND u.slack_id IS NOT NULL
    """;

        return jdbc.queryForList(sql, String.class, tipo);
    }
}