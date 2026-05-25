package futour.sight.etl.turistas.service;

import futour.sight.dao.ConfiguracaoNotificacaoDAO;
import futour.sight.etl.turistas.dao.ChegadaTuristaDAO;
import futour.sight.etl.turistas.dto.ChegadaTuristaDTO;
import futour.sight.etl.turistas.reader.ExcelReader;
import futour.sight.log.dao.LogDAO;
import futour.sight.service.NotificacaoService;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class TuristaEtlService {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private final ExcelReader reader;
    private final ChegadaTuristaDAO dao;
    private final LogDAO logDAO;
    private final NotificacaoService notificacaoService;

    public TuristaEtlService(JdbcTemplate jdbc) {

        this.reader = new ExcelReader();

        this.dao = new ChegadaTuristaDAO(jdbc);

        this.logDAO = new LogDAO(jdbc);

        ConfiguracaoNotificacaoDAO configuracaoDAO =
                new ConfiguracaoNotificacaoDAO(jdbc);

        this.notificacaoService =
                new NotificacaoService(configuracaoDAO);
    }

    public int executar(String caminho) {

        List<ChegadaTuristaDTO> lista;

        try {

            lista = reader.ler(caminho);

            log(
                    "SUCESSO",
                    "Leitura concluída - "
                            + lista.size()
                            + " registros"
            );

            if (lista.isEmpty()) {

                log(
                        "INFO",
                        "Arquivo sem dados"
                );

                return 0;
            }

        } catch (Exception e) {

            logDAO.inserir(
                    "chegadas_turistas",
                    0,
                    false,
                    "Erro na leitura: " + e.getMessage()
            );

            log(
                    "ERRO",
                    "Falha na leitura - "
                            + e.getMessage()
            );

            throw new RuntimeException(e);
        }

        try {

            dao.salvarBatch(lista);

            logDAO.inserir(
                    "chegadas_turistas",
                    lista.size(),
                    true,
                    "ETL executado com sucesso"
            );

            log(
                    "SUCESSO",
                    "Dados inseridos - "
                            + lista.size()
                            + " registros"
            );

            return lista.size();

        } catch (Exception e) {

            logDAO.inserir(
                    "chegadas_turistas",
                    lista.size(),
                    false,
                    "Erro ao salvar: " + e.getMessage()
            );

            log(
                    "ERRO",
                    "Falha ao salvar - "
                            + e.getMessage()
            );

            throw new RuntimeException(e);
        }
    }

    public void executarTodosDoS3(
            S3Client s3Client,
            String bucketName,
            String prefix
    ) {

        ListObjectsV2Request request =
                ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .prefix(prefix)
                        .build();

        ListObjectsV2Response response =
                s3Client.listObjectsV2(request);

        for (S3Object object : response.contents()) {

            String key = object.key();

            if (!key.endsWith(".xlsx")) {
                continue;
            }

            try {

                log(
                        "INFO",
                        "Processando arquivo: "
                                + key
                );

                executarDoS3(
                        s3Client,
                        bucketName,
                        key
                );

            } catch (Exception e) {

                log(
                        "ERRO",
                        "Falha no arquivo "
                                + key
                                + " - "
                                + e.getMessage()
                );
            }
        }
    }

    public void executarDoS3(
            S3Client s3Client,
            String bucketName,
            String objectKey
    ) throws IOException {

        Instant inicio = Instant.now();

        log(
                "INFO",
                "Baixando S3: s3://"
                        + bucketName
                        + "/"
                        + objectKey
        );

        File tempFile =
                baixarArquivoDoS3(
                        s3Client,
                        bucketName,
                        objectKey
                );

        log(
                "SUCESSO",
                "Download concluído"
        );

        try {

            int total =
                    executar(
                            tempFile.getAbsolutePath()
                    );

            int tempo =
                    (int) Duration
                            .between(inicio, Instant.now())
                            .getSeconds();

            notificacaoService.notificarEtlSucesso(
                    "chegadas_turistas",
                    total,
                    tempo
            );

        } catch (Exception e) {

            notificacaoService.notificarEtlErro(
                    "chegadas_turistas",
                    e.getMessage()
            );

            throw e;

        } finally {

            Files.deleteIfExists(
                    tempFile.toPath()
            );
        }
    }

    private File baixarArquivoDoS3(
            S3Client s3Client,
            String bucketName,
            String objectKey
    ) throws IOException {

        Path tempPath =
                Files.createTempFile(
                        "etl-turistas-",
                        ".xlsx"
                );

        Files.deleteIfExists(tempPath);

        GetObjectRequest request =
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .build();

        s3Client.getObject(
                request,
                ResponseTransformer.toFile(tempPath)
        );

        return tempPath.toFile();
    }

    private void log(
            String nivel,
            String mensagem
    ) {

        String timestamp =
                LocalDateTime.now()
                        .format(FORMATTER);

        String saida =
                "[" + timestamp + "] "
                        + "[" +nivel + "] "
                        + mensagem;

        if ("ERRO".equals(nivel)) {

            System.err.println(saida);

        } else {

            System.out.println(saida);
        }
    }
}