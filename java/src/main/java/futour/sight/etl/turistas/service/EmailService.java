package futour.sight.etl.turistas.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class EmailService {

    private final String emailUser;
    private final String emailPass;

    public EmailService() {
        this.emailUser = System.getenv("EMAIL_USER");
        this.emailPass = System.getenv("EMAIL_PASS");
    }

    public void enviarNovosAnos(
            String emailDestinatario,
            String nomeDestinatario,
            String nomeEmpresa,
            int anoNovo,
            long totalNovo,
            long totalAnterior,
            String paisLider,
            String melhorMes
    ) throws MessagingException {

        Session session = criarSession();

        MimeMessage message = new MimeMessage(session);

        try {
            message.setFrom(new InternetAddress(emailUser, "FuTour Sight"));
        } catch (java.io.UnsupportedEncodingException e) {
            message.setFrom(new InternetAddress(emailUser));
        }

        message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(emailDestinatario)
        );

        message.setSubject(
                "📊 Novos dados disponíveis — Chegadas " + anoNovo
        );

        message.setContent(
                montarHtml(
                        nomeDestinatario,
                        nomeEmpresa,
                        anoNovo,
                        totalNovo,
                        totalAnterior,
                        paisLider,
                        melhorMes
                ),
                "text/html; charset=utf-8"
        );

        Transport.send(message);
    }

    private Session criarSession() {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailUser, emailPass);
            }
        });
    }

    private String montarHtml(
            String nome,
            String empresa,
            int anoNovo,
            long totalNovo,
            long totalAnterior,
            String paisLider,
            String melhorMes
    ) {

        double variacao = totalAnterior > 0
                ? ((double) (totalNovo - totalAnterior) / totalAnterior) * 100
                : 0;

        String sinal = variacao >= 0 ? "+" : "";
        String emoji = variacao >= 0 ? "📈" : "📉";
        String anoAnterior = String.valueOf(anoNovo - 1);

        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

                    <div style="background-color: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">
                            📊 FuTour Sight
                        </h1>
                        <p style="color: #a0a0b0; margin: 4px 0 0 0; font-size: 14px;">
                            Novos dados disponíveis
                        </p>
                    </div>

                    <div style="background-color: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">

                        <p style="color: #333;">Olá, <strong>%s</strong>!</p>
                        <p style="color: #333;">
                            Os dados de chegadas de turistas de <strong>%d</strong>
                            já estão disponíveis na plataforma para <strong>%s</strong>.
                        </p>

                        <div style="background: #ffffff; border: 1px solid #e0e0e0;
                                    border-radius: 8px; padding: 20px; margin: 20px 0;">

                            <h2 style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px 0;">
                                Resumo — Chegadas %d
                            </h2>

                            <table style="width: 100%%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">
                                        Total de chegadas
                                    </td>
                                    <td style="padding: 8px 0; color: #1a1a2e;
                                               font-weight: bold; text-align: right;">
                                        %,d
                                    </td>
                                </tr>
                                <tr style="background-color: #f5f5f5;">
                                    <td style="padding: 8px; color: #666; font-size: 14px;">
                                        %s vs %s
                                    </td>
                                    <td style="padding: 8px; font-weight: bold;
                                               text-align: right; color: %s;">
                                        %s %s%.1f%%
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">
                                        País que mais visitou
                                    </td>
                                    <td style="padding: 8px 0; color: #1a1a2e;
                                               font-weight: bold; text-align: right;">
                                        %s
                                    </td>
                                </tr>
                                <tr style="background-color: #f5f5f5;">
                                    <td style="padding: 8px; color: #666; font-size: 14px;">
                                        Mês de pico
                                    </td>
                                    <td style="padding: 8px; color: #1a1a2e;
                                               font-weight: bold; text-align: right;">
                                        %s
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin: 24px 0;">
                            <a href="http://futour.duckdns.org"
                               style="background-color: #1a1a2e; color: #ffffff;
                                      padding: 12px 32px; border-radius: 6px;
                                      text-decoration: none; font-size: 14px;">
                                Acessar Site
                            </a>
                        </div>

                        <p style="color: #999; font-size: 12px; text-align: center;">
                            FuTour Sight — Plataforma de Inteligência Turística
                        </p>
                    </div>
                </div>
                """.formatted(
                nome,
                anoNovo,
                empresa,
                anoNovo,
                totalNovo,
                String.valueOf(anoNovo),
                anoAnterior,
                variacao >= 0 ? "#2e7d32" : "#c62828",
                emoji,
                sinal,
                variacao,
                paisLider,
                melhorMes
        );
    }
}