package futour.sight.etl.turistas.service;

import futour.sight.etl.turistas.dao.ChegadaTuristaDAO;
import futour.sight.etl.turistas.dto.ChegadaTuristaDTO;
import futour.sight.etl.turistas.reader.ExcelReader;
import futour.sight.log.dao.LogDAO;
import futour.sight.service.NotificacaoService;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

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

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private ExcelReader reader;
    private ChegadaTuristaDAO dao;
    private LogDAO logDAO;

    public TuristaEtlService(JdbcTemplate jdbc) {
        this.reader = new ExcelReader();
        this.dao = new ChegadaTuristaDAO(jdbc);
        this.logDAO = new LogDAO(jdbc);
    }

    public int executar(String caminho) {

        List<ChegadaTuristaDTO> lista;

        try {
            lista = reader.ler(caminho);
            logDAO.inserir("chegadas_turistas", lista.size(), true, null);
            log("SUCESSO", "Leitura do Excel concluida — " + lista.size() + " registros lidos");
        } catch (Exception e) {
            logDAO.inserir("chegadas_turistas", 0, false, "Erro na leitura do Excel: " + e.getMessage());
            log("ERRO", "Leitura do Excel falhou — " + e.getMessage());
            throw new RuntimeException(e);
        }

        try {
            dao.salvarBatch(lista);
            logDAO.inserir("chegadas_turistas", lista.size(), true, null);
            log("SUCESSO", "Registros inseridos no banco — " + lista.size() + " registros");
            return lista.size();
        } catch (Exception e) {
            logDAO.inserir("chegadas_turistas", lista.size(), false, "Erro ao salvar no banco: " + e.getMessage());
            log("ERRO", "Falha ao inserir no banco — " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public void executarDoS3(S3Client s3Client, String bucketName, String objectKey) throws IOException {

        Instant inicio = Instant.now();

        log("INFO", "Baixando S3: s3://" + bucketName + "/" + objectKey);

        File tempFile = baixarArquivoDoS3(s3Client, bucketName, objectKey);

        log("SUCESSO", "Download concluído");

        try {
            int total = executar(tempFile.getAbsolutePath());

            int tempo = (int) Duration.between(inicio, Instant.now()).getSeconds();

            NotificacaoService.notificarEtlSucesso("chegadas_turistas", total, tempo);

            if (tempFile.exists()) {
                tempFile.delete();
            }

        } catch (Exception e) {

            NotificacaoService.notificarEtlErro("chegadas_turistas", e.getMessage());

            if (tempFile.exists()) {
                tempFile.delete();
            }

            throw e;
        }
    }

    private File baixarArquivoDoS3(S3Client s3Client, String bucketName, String objectKey)
            throws IOException {

        Path tempPath = Files.createTempFile("etl-turistas-", ".xlsx");

        Files.deleteIfExists(tempPath);

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        s3Client.getObject(request, ResponseTransformer.toFile(tempPath));

        return tempPath.toFile();
    }

    private void log(String nivel, String mensagem) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String saida = "[" + timestamp + "] [" + nivel + "] " + mensagem;

        if (nivel.equals("ERRO")) {
            System.err.println(saida);
        } else {
            System.out.println(saida);
        }
    }
}