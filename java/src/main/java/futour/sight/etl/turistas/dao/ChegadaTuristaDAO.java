package futour.sight.etl.turistas.dao;

import futour.sight.etl.turistas.dto.ChegadaTuristaDTO;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class ChegadaTuristaDAO {

    private static final int TAMANHO_LOTE = 1000;

    private JdbcTemplate jdbc;

    public ChegadaTuristaDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void salvarBatch(List<ChegadaTuristaDTO> lista) {

        String sql = """
                INSERT INTO chegadas_turistas
                (via_de_acesso, uf, nome_pais_origem, mes, ano, chegadas)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        for (int i = 0; i < lista.size(); i += TAMANHO_LOTE) {
            List<ChegadaTuristaDTO> lote = lista.subList(i, Math.min(i + TAMANHO_LOTE, lista.size()));

            jdbc.batchUpdate(sql, lote, lote.size(), (ps, item) -> {
                ps.setString(1, item.getViaDeAcesso());
                ps.setString(2, item.getUf());
                ps.setString(3, item.getPais());
                ps.setString(4, item.getMes());
                ps.setInt(5, item.getAno());
                ps.setInt(6, item.getChegadas());
            });
        }
    }
}