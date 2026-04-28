package futour.sight.config;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseConfig {

    private static JdbcTemplate jdbc;

    public static JdbcTemplate getJdbcTemplate() {

        if (jdbc == null) {

            String dbHost = System.getenv("DB_HOST");
            String dbPort = System.getenv("DB_PORT");
            String dbName = System.getenv("DB_DATABASE");
            String dbUser = System.getenv("DB_USER");
            String dbPassword = System.getenv("DB_PASSWORD");

            String jdbcUrl = String.format("jdbc:mysql://%s:%s/%s", dbHost, dbPort, dbName);

            BasicDataSource ds = new BasicDataSource();
            ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
            ds.setUrl(jdbcUrl);
            ds.setUsername(dbUser);
            ds.setPassword(dbPassword);

            jdbc = new JdbcTemplate(ds);
        }
        return jdbc;
    }
}