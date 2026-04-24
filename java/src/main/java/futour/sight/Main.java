package futour.sight;

import futour.sight.config.DatabaseConfig;
import futour.sight.config.S3Provider;
import futour.sight.etl.turistas.service.TuristaEtlService;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.services.s3.S3Client;

public class Main {

    public static void main(String[] args) throws Exception {

        String bucketName = "s3-futoursight";
        String objectKey = "chegadas-2024.xlsx";

        S3Client s3Client = S3Provider.getS3Client();
        JdbcTemplate jdbc = DatabaseConfig.getJdbcTemplate();

        TuristaEtlService etl = new TuristaEtlService(jdbc);

        etl.executarDoS3(s3Client, bucketName, objectKey);
    }
}