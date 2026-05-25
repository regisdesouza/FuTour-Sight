package futour.sight.dao;

import org.springframework.jdbc.core.JdbcTemplate;

public abstract class BaseDAO {

    protected JdbcTemplate jdbc;

    public BaseDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }
}