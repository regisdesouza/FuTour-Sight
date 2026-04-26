package futour.sight.config;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseConfig {

    private static JdbcTemplate jdbc;

    public static JdbcTemplate getJdbcTemplate() {

        if (jdbc == null) {
            BasicDataSource ds = new BasicDataSource();

            ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
            ds.setUrl("jdbc:mysql://ContainerBanco:3306/futour_sight");
            ds.setUsername("futour");
            ds.setPassword("Senha@1234");

            jdbc = new JdbcTemplate(ds);
        }

        return jdbc;
    }
}






