package futour.sight.config;

import com.slack.api.Slack;
import com.slack.api.webhook.Payload;
import com.slack.api.webhook.WebhookResponse;

    public class SlackConfig {

        private static final String WEBHOOK_URL =
                System.getenv("SLACK_WEBHOOK_URL");

        private static final Slack slack =
                Slack.getInstance();

        public static void enviarMensagem(String mensagem) {

            try {

                Payload payload = Payload.builder()
                        .text(mensagem)
                        .build();

                WebhookResponse response =
                        slack.send(WEBHOOK_URL, payload);

                if (response.getCode() != 200) {

                    System.err.println(
                            "Erro ao enviar mensagem para Slack: "
                                    + response.getBody()
                    );
                }

            } catch (Exception e) {

                System.err.println(
                        "Erro ao enviar para Slack: "
                                + e.getMessage()
                );
            }
        }

        public static void enviarMensagemFormatada(
                String titulo,
                String mensagem,
                String cor
        ) {

            try {

                Payload payload = Payload.builder()
                        .text("*" + titulo + "*\n" + mensagem)
                        .build();

                WebhookResponse response =
                        slack.send(WEBHOOK_URL, payload);

                if (response.getCode() != 200) {

                    System.err.println(
                            "Erro ao enviar mensagem para Slack: "
                                    + response.getBody()
                    );
                }

            } catch (Exception e) {

                System.err.println(
                        "Erro ao enviar para Slack: "
                                + e.getMessage()
                );
            }
        }
    }