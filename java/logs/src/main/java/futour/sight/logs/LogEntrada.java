package futour.sight.logs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LogEntrada {

    private LocalDateTime dataHora;
    private LogNivel nivel;
    private LogAcoes acao;
    private Integer idUsuario;
    private Integer idEmpresa;
    private String descricao;

    public LogEntrada(LogNivel nivel,
                      LogAcoes acao,
                      Integer idUsuario,
                      Integer idEmpresa,
                      String descricao) {

        this.dataHora = LocalDateTime.now();
        this.nivel = nivel;
        this.acao = acao;
        this.idUsuario = idUsuario;
        this.idEmpresa = idEmpresa;
        this.descricao = descricao;
    }

    public String formatar() {

        DateTimeFormatter formato =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        return String.format(
                "%s | %s | %s | Usuario: %s | Empresa: %s | %s",
                dataHora.format(formato),
                nivel,
                acao,
                idUsuario,
                idEmpresa,
                descricao
        );
    }
}