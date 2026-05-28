package futour.sight;

import futour.sight.config.DatabaseConfig;
import futour.sight.config.S3Provider;
import futour.sight.etl.turistas.service.TuristaEtlService;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.services.s3.S3Client;

public class Main {

    public static void main(String[] args) throws Exception {

        String bucketName = System.getenv("S3_BUCKET_NAME");

        S3Client s3Client = S3Provider.getS3Client();
        JdbcTemplate jdbc = DatabaseConfig.getJdbcTemplate();

        TuristaEtlService etl = new TuristaEtlService(jdbc);

        etl.executarTodosDoS3(s3Client, bucketName, "chegadas-");
    }
}