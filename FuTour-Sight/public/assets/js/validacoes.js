function validarNome(valor) {
    const nome = valor.trim();

    if (nome == '') {
        return "Preencha o campo Nome Completo";
    } else if (nome.length < 3) {
        return "Nome muito curto";
    } else if (nome.indexOf(' ') == -1) {
        return "Digite o nome completo";
    }

    return "";
}

function validarEmail(valor) {
    const email = valor.trim();

    if (email == '') {
        return "Preencha o campo E-mail de Contato";
    } else if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        return "E-mail de Contato inválido, insira um '@' e um '.' ; Exemplo: exemplo@exemplo.com";
    } else if (email.startsWith("@") || email.endsWith("@")) {
        return "E-mail de Contato inválido. O e-mail não pode iniciar e nem finalizar com '@'";
    } else if (email.lastIndexOf(".") < email.indexOf("@")) {
        return "E-mail de Contato inválido, está faltando um '.' depois do '@'";
    }

    return "";
}

function validarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");

    if (numeros == '') {
        return "Preencha o Telefone de Contato";
    } else if (numeros.length != 11) {
        return "Telefone de Contato inválido";
    } 

    return "";
}

function validarMensagem(valor) {
    const mensagem = valor.trim();

    if (mensagem == '') {
        return "Preencha a Mensagem";
    } else if (mensagem.length < 10) {
        return "Mensagem muito curta";
    } else if (mensagem.length > 800) {
        return "Mensagem muito longa";
    }

    return "";
}

function validarSenha(valor) {
    const senha = valor.trim();

    if (senha == '') {
        return "Preencha a senha";
    } else if (senha.length < 8) {
        return "A senha deve ter pelo menos 8 caracteres";
    } else if (senha.indexOf(' ') != -1) {
        return "A senha não pode conter espaços";
    } else if (!/[0-9]/.test(senha)) {
        return "A senha deve conter pelo menos um número";
    } else if (!/[a-z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra minúscula";
    } else if (!/[A-Z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra maiúscula";
    } else if (!/[!@#$%&*]/.test(senha)) {
        return "A senha deve conter pelo menos um caractere especial";
    }

    return "";
}