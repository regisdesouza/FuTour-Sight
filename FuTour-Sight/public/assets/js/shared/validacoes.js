function validarNome(valor) {
    const nome = valor.trim();

    if (nome == "") {
        return "Preencha o Nome Completo";
    }

    if (nome.length < 3) {
        return "Nome muito curto";
    }

    if (nome.indexOf(" ") == -1) {
        return "Digite o nome completo";
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        return "O nome deve conter apenas letras";
    }

    return "";
}

function validarNomeEmpresa(valor) {
    const nomeEmpresa = valor.trim();

    if (nomeEmpresa == "") {
        return "Preencha o Nome da Empresa";
    }

    if (nomeEmpresa.length < 3) {
        return "Nome da empresa muito curto";
    }

    return "";
}

function validarEmail(valor) {
    const email = valor.trim();

    if (email == "") {
        return "Preencha o E-mail";
    }

    if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        return "E-mail inválido";
    }

    if (email.startsWith("@") || email.endsWith("@")) {
        return "E-mail inválido";
    }

    if (email.lastIndexOf(".") < email.indexOf("@")) {
        return "E-mail inválido";
    }

    return "";
}

function validarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");

    if (numeros == "") {
        return "Preencha o Telefone";
    }

    if (numeros.length != 11) {
        return "Telefone inválido";
    }

    return "";
}

function validarMensagem(valor) {
    const mensagem = valor.trim();

    if (mensagem == "") {
        return "Preencha a Mensagem";
    }

    if (mensagem.length < 10) {
        return "Mensagem muito curta";
    }

    if (mensagem.length > 800) {
        return "Mensagem muito longa";
    }

    return "";
}

function validarSenha(valor) {
    const senha = valor.trim();

    if (senha == "") {
        return "Preencha a Senha";
    }

    if (senha.length < 8) {
        return "A senha deve ter pelo menos 8 caracteres";
    }

    if (senha.indexOf(" ") != -1) {
        return "A senha não pode conter espaços";
    }

    if (!/[0-9]/.test(senha)) {
        return "A senha deve conter pelo menos um número";
    }

    if (!/[a-z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra minúscula";
    }

    if (!/[A-Z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra maiúscula";
    }

    if (!/[!@#$%&*]/.test(senha)) {
        return "A senha deve conter pelo menos um caractere especial";
    }

    return "";
}

function validarConfirmacaoSenha(senha, confirmacaoSenha) {
    if (confirmacaoSenha.trim() == "") {
        return "Confirme a senha";
    }

    if (senha != confirmacaoSenha) {
        return "As senhas não coincidem";
    }

    return "";
}

function validarCnpj(valor) {
    const cnpj = valor.replace(/\D/g, "");

    if (cnpj == "") {
        return "Preencha o CNPJ";
    }

    if (cnpj.length != 14) {
        return "CNPJ inválido";
    }

    if (/^(\d)\1+$/.test(cnpj)) {
        return "CNPJ inválido";
    }

    return "";
}

function validarCep(valor) {
    const cep = valor.replace(/\D/g, "");

    if (cep == "") {
        return "Preencha o CEP";
    }

    if (cep.length != 8) {
        return "CEP inválido";
    }

    return "";
}

function validarEstado(valor) {
    const estado = valor.trim();

    if (estado == "") {
        return "Selecione um Estado";
    }

    return "";
}

function validarCidade(valor) {
    const cidade = valor.trim();

    if (cidade == "") {
        return "Preencha a Cidade";
    }

    if (cidade.length < 2) {
        return "Cidade inválida";
    }

    return "";
}

function validarBairro(valor) {
    const bairro = valor.trim();

    if (bairro == "") {
        return "Preencha o Bairro";
    }

    if (bairro.length < 2) {
        return "Bairro inválido";
    }

    return "";
}

function validarLogradouro(valor) {
    const logradouro = valor.trim();

    if (logradouro == "") {
        return "Preencha o Logradouro";
    }

    if (logradouro.length < 3) {
        return "Logradouro inválido";
    }

    return "";
}

function validarNumeroEndereco(valor) {
    const numero = valor.trim();

    if (numero == "") {
        return "Preencha o Número";
    }

    return "";
}

function validarComplemento(valor) {
    const complemento = valor.trim();

    if (complemento.length > 100) {
        return "Complemento muito longo";
    }

    return "";
}

function validarPermissao(valor) {
    if (valor == "" || valor == null) {
        return "Selecione uma Permissão";
    }

    return "";
}

function validarFiltro(valor) {
    if (valor == "" || valor == null) {
        return "Selecione uma opção";
    }

    return "";
}

function validarNomeFiltro(valor) {
    const nomeFiltro = valor.trim();

    if (nomeFiltro == "") {
        return "Preencha o nome do filtro";
    }

    if (nomeFiltro.length < 3) {
        return "Nome do filtro muito curto";
    }

    return "";
}

function validarAno(valor) {
    if (valor == "" || valor == null) {
        return "Selecione um ano";
    }

    return "";
}

function validarMes(valor) {
    if (valor == "" || valor == null) {
        return "Selecione um mês";
    }

    return "";
}

function validarPeriodo(mesInicio, mesFim) {
    if (mesInicio == "" || mesFim == "") {
        return "Selecione o período";
    }

    if (Number(mesInicio) > Number(mesFim)) {
        return "O mês inicial não pode ser maior que o final";
    }

    return "";
}

function validarSelectMultiplo(lista) {
    if (!lista || lista.length == 0) {
        return "Selecione pelo menos uma opção";
    }

    return "";
}

function validarCampoObrigatorio(valor, nomeCampo) {
    if (valor.trim() == "") {
        return `Preencha o campo ${nomeCampo}`;
    }

    return "";
}