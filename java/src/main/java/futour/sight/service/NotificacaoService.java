package futour.sight.service;

import futour.sight.config.SlackConfig;
import futour.sight.dao.ConfiguracaoNotificacaoDAO;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class NotificacaoService {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private ConfiguracaoNotificacaoDAO configuracaoDAO;

    public NotificacaoService(ConfiguracaoNotificacaoDAO configuracaoDAO) {
        this.configuracaoDAO = configuracaoDAO;
    }

    public void notificarEtlSucesso(String tabela, int registros, long tempoSegundos) {

        if (!configuracaoDAO.isAtivo("ETL_SUCESSO")) {
            System.out.println("[SLACK] ETL_SUCESSO desativado");
            return;
        }

        List<String> destinatarios =
                configuracaoDAO.getDestinatariosAtivos("ETL_SUCESSO");

        if (destinatarios.isEmpty()) {
            System.out.println("[SLACK] Nenhum destinatário ativo");
            return;
        }

        String mensagem = String.format("""
                *Tabela:* %s
                *Registros processados:* %,d
                *Tempo:* %d segundos
                *Horário:* %s
                """,
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

    public void notificarEtlErro(String tabela, String erro) {

        if (!configuracaoDAO.isAtivo("ETL_ERRO")) {
            System.out.println("[SLACK] ETL_ERRO desativado");
            return;
        }

        List<String> destinatarios =
                configuracaoDAO.getDestinatariosAtivos("ETL_ERRO");

        if (destinatarios.isEmpty()) {
            System.out.println("[SLACK] Nenhum destinatário ativo");
            return;
        }

        String mensagem = String.format("""
                *Tabela:* %s
                *Erro:* %s
                *Horário:* %s

                ⚠️ *Ação necessária:* Verificar logs
                """,
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
}