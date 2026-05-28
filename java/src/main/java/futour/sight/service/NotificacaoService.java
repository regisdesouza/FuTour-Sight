package futour.sight.service;

import futour.sight.config.SlackConfig;
import futour.sight.dao.ConfiguracaoNotificacaoDAO;
import futour.sight.dao.EmpresaAdminDAO;
import futour.sight.etl.turistas.service.EmailService;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class NotificacaoService {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private ConfiguracaoNotificacaoDAO configuracaoDAO;

    public NotificacaoService(
            ConfiguracaoNotificacaoDAO configuracaoDAO
    ) {

        this.configuracaoDAO = configuracaoDAO;
    }

    public void notificarEtlSucesso(
            String tabela,
            int registros,
            long tempoSegundos
    ) {

        if (!configuracaoDAO.isAtivo("ETL_SUCESSO")) {

            System.out.println(
                    "[SLACK] ETL_SUCESSO desativado"
            );

            return;
        }

        List<String> destinatarios =
                configuracaoDAO.getDestinatariosAtivos(
                        "ETL_SUCESSO"
                );

        if (destinatarios.isEmpty()) {

            System.out.println(
                    "[SLACK] Nenhum destinatário ativo"
            );

            return;
        }

        String mentions = "";

        for (String id : destinatarios) {
            mentions += "<@" + id + "> ";
        }

        String mensagem = String.format("""
                %s

                *Tabela:* %s
                *Registros processados:* %,d
                *Tempo:* %d segundos
                *Horário:* %s
                """,
                mentions,
                tabela,
                registros,
                tempoSegundos,
                LocalDateTime.now().format(FORMATTER)
        );

        SlackConfig.enviarMensagemFormatada(
                "ETL Executado com Sucesso",
                mensagem,
                "good"
        );
    }

    public void notificarEtlErro(
            String tabela,
            String erro
    ) {

        if (!configuracaoDAO.isAtivo("ETL_ERRO")) {

            System.out.println(
                    "[SLACK] ETL_ERRO desativado"
            );

            return;
        }

        List<String> destinatarios =
                configuracaoDAO.getDestinatariosAtivos(
                        "ETL_ERRO"
                );

        if (destinatarios.isEmpty()) {

            System.out.println(
                    "[SLACK] Nenhum destinatário ativo"
            );

            return;
        }

        String mentions = "";

        for (String id : destinatarios) {
            mentions += "<@" + id + "> ";
        }

        String mensagem = String.format("""
                %s

                *Tabela:* %s
                *Erro:* %s
                *Horário:* %s

                ⚠️ *Ação necessária:* Verificar logs
                """,
                mentions,
                tabela,
                erro,
                LocalDateTime.now().format(FORMATTER)
        );

        SlackConfig.enviarMensagemFormatada(
                "ETL Falhou",
                mensagem,
                "danger"
        );
    }
    public void notificarClienteNovosAnos(
            String arquivo,
            JdbcTemplate jdbc
    ) {
        int anoNovo;
        try {
            String semExtensao = arquivo.replace(".xlsx", "");
            anoNovo = Integer.parseInt(
                    semExtensao.substring(semExtensao.lastIndexOf("-") + 1)
            );
        } catch (Exception e) {
            System.out.println(
                    "[EMAIL] Não foi possível extrair o ano do arquivo: " + arquivo
            );
            return;
        }

        int anoAnterior = anoNovo - 1;

        EmpresaAdminDAO empresaAdminDAO = new EmpresaAdminDAO(jdbc);
        EmailService emailService = new EmailService();

        long totalNovo = empresaAdminDAO.getTotalChegadas(anoNovo);
        long totalAnterior = empresaAdminDAO.getTotalChegadas(anoAnterior);
        String paisLider = empresaAdminDAO.getPaisLider(anoNovo);
        String melhorMes = empresaAdminDAO.getMelhorMes(anoNovo);

        List<Map<String, Object>> admins = empresaAdminDAO.getAdminsAtivos();

        if (admins.isEmpty()) {
            System.out.println("[EMAIL] Nenhum EMPRESA_ADMIN ativo encontrado");
            return;
        }

        for (Map<String, Object> admin : admins) {

            String email = (String) admin.get("email");
            String nome = (String) admin.get("nome");
            String empresa = (String) admin.get("empresa");

            try {

                emailService.enviarNovosAnos(
                        email,
                        nome,
                        empresa,
                        anoNovo,
                        totalNovo,
                        totalAnterior,
                        paisLider,
                        melhorMes
                );

                System.out.println(
                        "[EMAIL] Enviado para: " + email
                );

            } catch (Exception e) {

                System.err.println(
                        "[EMAIL] Falha ao enviar para " + email + ": " + e.getMessage()
                );
            }
        }
    }
}