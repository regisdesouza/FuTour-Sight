package futour.sight.service;

import futour.sight.config.SlackConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NotificacaoService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static void notificarNovaSolicitacao(String nomeEmpresa, String responsavel, String cnpj, String email) {
        String mensagem = String.format("""
                📋 *Nova Solicitação de Cadastro*
                
                *Empresa:* %s
                *Responsável:* %s
                *CNPJ:* %s
                *Email:* %s
                *Data:* %s
                """,
                nomeEmpresa,
                responsavel,
                formatarCNPJ(cnpj),
                email,
                LocalDateTime.now().format(FORMATTER)
        );

        SlackConfig.enviarMensagemFormatada("Nova Solicitação", mensagem, "good");
    }

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

    public static void notificarNovaEmpresaAprovada(String nomeEmpresa, String cnpj) {
        String mensagem = String.format("""
                🎉 *Nova Empresa Ativada*
                
                *Empresa:* %s
                *CNPJ:* %s
                *Data:* %s
                """,
                nomeEmpresa,
                formatarCNPJ(cnpj),
                LocalDateTime.now().format(FORMATTER)
        );

        SlackConfig.enviarMensagemFormatada("Nova Empresa", mensagem, "good");
    }

    private static String formatarCNPJ(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) return cnpj;
        return String.format("%s.%s.%s/%s-%s",
                cnpj.substring(0, 2),
                cnpj.substring(2, 5),
                cnpj.substring(5, 8),
                cnpj.substring(8, 12),
                cnpj.substring(12, 14)
        );
    }
}