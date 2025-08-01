let jogarNovamente = true;
let tentativas = 6;
let listaDinamica = [];
let palavraSecretaCategoria;
let palavraSecretaSorteada;
let palavras = [];
let jogoAutomatico = true;

carregaListaAutomatica();
criarPalavraSecreta();
montarPalavraNaTela();

function criarPalavraSecreta() {
    const indexPalavra = parseInt(Math.random() * palavras.length);
    palavraSecretaSorteada = palavras[indexPalavra].nome.toUpperCase();
    palavraSecretaCategoria = palavras[indexPalavra].categoria;
}

function montarPalavraNaTela() {
    const categoria = document.getElementById("categoria");
    categoria.innerHTML = palavraSecretaCategoria;

    const palavraTela = document.getElementById("palavra-secreta");
    palavraTela.innerHTML = "";

    for (let i = 0; i < palavraSecretaSorteada.length; i++) {
        if (listaDinamica[i] === undefined) {
            if (palavraSecretaSorteada[i] === " ") {
                listaDinamica[i] = " ";
                palavraTela.innerHTML += "<div class='letrasEspaco'>" + listaDinamica[i] + "</div>";
            } else {
                listaDinamica[i] = "&nbsp;";
                palavraTela.innerHTML += "<div class='letras'>" + listaDinamica[i] + "</div>";
            }
        } else {
            if (palavraSecretaSorteada[i] === " ") {
                palavraTela.innerHTML += "<div class='letrasEspaco'>" + listaDinamica[i] + "</div>";
            } else {
                palavraTela.innerHTML += "<div class='letras'>" + listaDinamica[i] + "</div>";
            }
        }
    }
}

function verificaLetraEscolhida(letra) {
    document.getElementById("tecla-" + letra).disabled = true;
    if (tentativas > 0) {
        mudarStyleLetra("tecla-" + letra, false);
        comparalistas(letra);
        montarPalavraNaTela();
    }
}

function mudarStyleLetra(tecla, condicao) {
    const elemento = document.getElementById(tecla);
    elemento.style.background = condicao ? "#008000" : "#C71585";
    elemento.style.color = "#ffffff";
}

function comparalistas(letra) {
    const pos = palavraSecretaSorteada.indexOf(letra);
    if (pos < 0) {
        tentativas--;
        carregaImagemForca();
        if (tentativas === 0) {
            abreModal("OPS!", "Não foi dessa vez ... A palavra secreta era <br>" + palavraSecretaSorteada);
            piscarBotaoJogarNovamente(true);
        }
    } else {
        mudarStyleLetra("tecla-" + letra, true);
        for (let i = 0; i < palavraSecretaSorteada.length; i++) {
            if (palavraSecretaSorteada[i] === letra) {
                listaDinamica[i] = letra;
            }
        }
    }

    let vitoria = true;
    for (let i = 0; i < palavraSecretaSorteada.length; i++) {
        if (palavraSecretaSorteada[i] !== listaDinamica[i]) {
            vitoria = false;
            break;
        }
    }

    if (vitoria) {
        abreModal("PARABÉNS!", "Você venceu...");
        tentativas = 0;
        piscarBotaoJogarNovamente(true);
    }
}

async function atraso(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo));
}

function carregaImagemForca() {
    const imagem = document.getElementById("imagem");
    const imagens = [
        "./img/forca06.png",
        "./img/forca05.png",
        "./img/forca04.png",
        "./img/forca03.png",
        "./img/forca02.png",
        "./img/forca01.png",
        "./img/forca.png"
    ];
    imagem.style.background = `url('${imagens[6 - tentativas]}')`;
}

function abreModal(titulo, mensagem) {
    document.getElementById("exampleModalLabel").innerText = titulo;
    document.getElementById("modalBody").innerHTML = mensagem;
    $("#myModal").modal({ show: true });
}

let bntReiniciar = document.querySelector("#btnReiniciar");
bntReiniciar.addEventListener("click", function () {
    jogarNovamente = false;
    location.reload();
});

function listaAutomatica() {
    if (jogoAutomatico) {
        document.getElementById("jogarAutomatico").innerHTML = "<i class='bx bx-play-circle'></i>";
        palavras = [];
        jogoAutomatico = false;
        document.getElementById("abreModalAddPalavra").style.display = "block";
        document.getElementById("status").innerHTML = "Modo Manual";
    } else {
        document.getElementById("jogarAutomatico").innerHTML = "<i class='bx bx-pause-circle'></i>";
        jogoAutomatico = true;
        document.getElementById("abreModalAddPalavra").style.display = "none";
        document.getElementById("status").innerHTML = "Modo Automático";
        carregaListaAutomatica(); // recarrega a lista
        criarPalavraSecreta();
        montarPalavraNaTela();
    }
}

const modal = document.getElementById("modal-alerta");
document.getElementById("abreModalAddPalavra").onclick = function () {
    modal.style.display = "block";
};
document.getElementById("fechaModal").onclick = function () {
    fecharModal();
};
window.onclick = function (event) {
    if (event.target == modal) fecharModal();
};

function fecharModal() {
    modal.style.display = "none";
    document.getElementById("addPalavra").value = "";
    document.getElementById("addCategoria").value = "";
}

function adicionarPalavra() {
    let addPalavra = document.getElementById("addPalavra").value.toUpperCase();
    let addCategoria = document.getElementById("addCategoria").value.toUpperCase();

    if (isNullOrWhiteSpace(addPalavra) || isNullOrWhiteSpace(addCategoria) || addPalavra.length < 3 || addCategoria.length < 3) {
        abreModal("ATENÇÃO", "Palavra e/ou Categoria inválidos");
        return;
    }

    let novaPalavra = {
        nome: addPalavra,
        categoria: addCategoria
    };

    palavras.push(novaPalavra);
    criarPalavraSecreta();
    montarPalavraNaTela();
    fecharModal();
}

function isNullOrWhiteSpace(input) {
    return !input || !input.trim();
}

function piscarBotaoJogarNovamente(flag) {
    if (flag) {
        const btn = document.getElementById("btnReiniciar");
        let ativo = true;
        const intervalo = setInterval(() => {
            if (!jogarNovamente) {
                clearInterval(intervalo);
                btn.style.backgroundColor = "";
                btn.style.scale = "1";
                return;
            }
            btn.style.backgroundColor = ativo ? 'red' : 'yellow';
            btn.style.scale = ativo ? '1.3' : '1';
            ativo = !ativo;
        }, 500);
    }
}
