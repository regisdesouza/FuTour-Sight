package futour.sight.service;

import futour.sight.config.SlackConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NotificacaoService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static void notificarEtlSucesso(String tabela, int registros, long tempoSegundos) {
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

        SlackConfig.enviarMensagemFormatada("ETL Executado com Sucesso", mensagem, "good");
    }

    public static void notificarEtlErro(String tabela, String erro) {
        String mensagem = String.format("""
                *Tabela:* %s
                *Erro:* %s
                *Horário:* %s
                
                ⚠️ *Ação necessária:* Verificar logs e arquivo de origem
                """,
                tabela,
                erro,
                LocalDateTime.now().format(FORMATTER)
        );

        SlackConfig.enviarMensagemFormatada("ETL Falhou", mensagem, "danger");
    }


}