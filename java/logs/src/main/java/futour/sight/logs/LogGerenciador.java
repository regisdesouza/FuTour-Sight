package futour.sight.logs;

public class LogGerenciador {

    public static void registrar(LogNivel nivel,
                                 LogAcoes acao,
                                 Integer idUsuario,
                                 Integer idEmpresa,
                                 String descricao) {

        LogEntrada entrada = new LogEntrada(
                nivel,
                acao,
                idUsuario,
                idEmpresa,
                descricao
        );

        System.out.println(entrada.formatar());
    }
}

