function validarNome(valor) {
    if (valor == '') {
        return "Preencha o campo Nome Completo";
    }
    return "";
}

function validarEmail(valor) {
    if (valor == '') {
        return "Preencha o campo Email";
    } else if (valor.indexOf("@") == -1) {
        return "Email inválido";
    }
    return "";
}

function validarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");

    if (numeros == '') {
        return "Preencha o telefone";
    } else if (numeros.length != 11) {
        return "Telefone inválido";
    }

    return "";
}

function validarMensagem(valor) {
    if (valor == '') {
        return "Preencha a mensagem";
    } else if (valor.length < 10) {
        return "Mensagem muito curta";
    } else if (valor.length > 800) {
        return "Mensagem muito longa";
    }
    return "";
}

function validarSenha(valor) {
    if (valor == '') {
        return "Preencha a senha";
    }

    if (!/[0-9]/.test(valor)) {
        return "A senha deve conter pelo menos um número";
    }

    return "";
}