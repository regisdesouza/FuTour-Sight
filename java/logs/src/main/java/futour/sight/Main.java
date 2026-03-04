package futour.sight;

import futour.sight.logs.*;

public class Main {

    public static void main(String[] args) {

        LogGerenciador.registrar(
                LogNivel.INFORMACAO,
                LogAcoes.LOGIN,
                10,
                3,
                "Usuário realizou login com sucesso"
        );

        LogGerenciador.registrar(
                LogNivel.INFORMACAO,
                LogAcoes.CRIAR,
                null,
                5,
                "Empresa 'Hotel Central' cadastrada"
        );

        LogGerenciador.registrar(
                LogNivel.ERRO,
                LogAcoes.ATUALIZAR,
                5,
                2,
                "Erro ao atualizar unidade - CEP inválido"
        );
    }
}