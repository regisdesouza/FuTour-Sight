// function mostrarToast(mensagem, tipo = "sucesso") {
//     const toast = document.getElementById("toast");
//     const texto = document.getElementById("toastMensagem");

//     toast.className = `toast ${tipo}`;
//     texto.innerText = mensagem;

//     setTimeout(() => {
//         toast.classList.add("hidden");
//     }, 4000);
// }

function abrirModalConfirmacao({
    titulo = "Confirmação",
    texto = "Deseja continuar?",
    onConfirm = () => { }
}) {

    const modal = document.getElementById("modalConfirmacao");

    document.getElementById("modalTitulo").innerText = titulo;
    document.getElementById("modalTexto").innerText = texto;

    modal.classList.remove("hidden");

    const btnConfirmar = document.getElementById("btnConfirmarModal");
    const btnCancelar = document.getElementById("btnCancelarModal");

    btnConfirmar.onclick = () => {
        modal.classList.add("hidden");
        onConfirm();
    };

    btnCancelar.onclick = () => {
        modal.classList.add("hidden");
    };
}

function limparCampos(ids = []) {
    ids.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });
}

function obterPermissao() {
    return Number(sessionStorage.getItem("NIVEL_ACESSO"));
}

function usuarioEhProprietario() {
    return obterPermissao() === 2;
}

function usuarioEhGerente() {
    return obterPermissao() === 3;
}

function validarPermissao(permissoesPermitidas = []) {
    const permissao = obterPermissao();

    return permissoesPermitidas.includes(permissao);
}

function esconderElementoSemPermissao(elementId, permissoes = []) {
    const elemento = document.getElementById(elementId);

    if (!elemento) return;

    if (!validarPermissao(permissoes)) {
        elemento.style.display = "none";
    }
}

async function tratarRespostaFetch(resposta) {
    const data = await resposta.json();

    if (!resposta.ok) {
        throw new Error(data.mensagem || "Erro inesperado");
    }

    return data;
}

function preencherNomeUsuario() {
    const nomeUsuario = sessionStorage.getItem("NOME_USUARIO");

    const elementos = document.querySelectorAll("#nomeUser, #nomeUser-sidebar");

    elementos.forEach((el) => {
        if (el) {
            el.innerHTML = nomeUsuario || "Usuário";
        }
    });
}

function ativarToast(tipo, mensagem) {
    localStorage.setItem("showToast", "true");

    if (tipo && mensagem) {
        localStorage.setItem("tipoToast", tipo);
        localStorage.setItem("mensagemToast", mensagem);
    }
}

function verificarToast(
    tipo = localStorage.getItem("tipoToast"),
    mensagem = localStorage.getItem("mensagemToast")
) {
    if (localStorage.getItem("showToast") === 'true') {
        exibirToast(tipo, mensagem);
    }

    localStorage.removeItem('showToast')
    localStorage.removeItem('tipoToast')
    localStorage.removeItem('mensagemToast')
}

const div_toast = document.getElementById("toast")
let contador;

function exibirToast(tipo, mensagem) {
    div_toast.classList.add('exibindo')
    let imagem;

    if (tipo === "erro") {
        div_toast.classList.remove('sucesso');
        div_toast.classList.add('erro')
        imagem = `<img src="../../assets/images/icons/erro.png" alt="ícone de erro">`
    } else if (tipo === "sucesso") {
        div_toast.classList.remove('erro');
        div_toast.classList.add('sucesso')
        imagem = `<img src="../../assets/images/icons/sucesso.png" alt="ícone de sucesso">`
    }

    div_toast.innerHTML = `
        <div class="toast-content">
            ${imagem}
            <div class="toast-info">
                <p>${mensagem}</p>
                <button onclick="fecharToast()"><img src="../../assets/images/icons/x.png" alt="ícone de X"></button>
            </div>
        </div>
        <div id="barra-tempo"></div>
        `

    const barraTempo = document.getElementById("barra-tempo")
    let tempoTotal = 5000;
    let tempoRestante = tempoTotal;

    clearInterval(contador);
    barraTempo.style.width = "100%";

    contador = setInterval(() => {
        tempoRestante -= 10;
        let porcentagemTempo = (tempoRestante / tempoTotal) * 100;
        barraTempo.style.width = porcentagemTempo + "%";

        if (tempoRestante <= 0) {
            fecharToast();
        }
    }, 10)
}

function fecharToast() {
    div_toast.classList.remove('exibindo');
    clearInterval(contador);
    localStorage.removeItem('showToast')
}