package futour.sight;

import futour.sight.config.DatabaseConfig;
import futour.sight.etl.turistas.service.TuristaEtlService;
import org.springframework.jdbc.core.JdbcTemplate;

public class Main {

    public static void main(String[] args) {

        JdbcTemplate jdbc = DatabaseConfig.getJdbcTemplate();

        TuristaEtlService etl = new TuristaEtlService(jdbc);

        etl.executar("chegadas-2024.xlsx");
    }
}