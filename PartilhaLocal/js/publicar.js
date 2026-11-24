const formulario = document.querySelector("#form-publicar");
const mensagemPublicacao = document.querySelector("#mensagem-publicacao");
const camposTexto = formulario.querySelectorAll('input[type="text"], textarea');

// Impede que espaços sozinhos sejam aceites como conteudo.
camposTexto.forEach(function (campo) {
    campo.addEventListener("input", function () {
        const texto = campo.value.trim();

        if (texto.length < campo.minLength) {
            campo.setCustomValidity(
                `Escreva pelo menos ${campo.minLength} caracteres, sem contar espaços nas pontas.`);


        } else {
            campo.setCustomValidity("");
        }
    });
});

formulario.addEventListener("input", function () {
    mensagemPublicacao.textContent = "";
});


//-------------------------------------------------
//Regras para fotografia
const campoFotografia = document.querySelector("#fotografia");
const previewFotografia = document.querySelector("#preview-fotografia");
const erroFotografia = document.querySelector("#erro-fotografia");

let urlFotografia = null;

campoFotografia.addEventListener("change", function () {
    const ficheiro = campoFotografia.files[0];

    previewFotografia.hidden = true;
    previewFotografia.removeAttribute("src");
    erroFotografia.textContent = "";
    campoFotografia.setCustomValidity("");
    mensagemPublicacao.textContent = "";

    // Liberta a referência à fotografia anterior.
    if (urlFotografia) {
        URL.revokeObjectURL(urlFotografia);
        urlFotografia = null;
    }

    if (!ficheiro) {
        return;
    }

    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const tamanhoMaximo = 5 * 1024 * 1024;
    let erro = "";

    if (!formatosPermitidos.includes(ficheiro.type)) {
        erro = "Escolha uma imagem JPG, PNG ou WebP.";
    } else if (ficheiro.size > tamanhoMaximo) {
        erro = "A fotografia deve ter, no máximo, 5 MB.";
    }

    if (erro) {
        erroFotografia.textContent = erro;
        campoFotografia.setCustomValidity(erro);
        return;
    }

    // Cria um endereço temporário para mostrar o ficheiro local.
    urlFotografia = URL.createObjectURL(ficheiro);
    previewFotografia.src = urlFotografia;
});

previewFotografia.addEventListener("load", function () {
    previewFotografia.hidden = false;
});

previewFotografia.addEventListener("error", function () {
    if (!previewFotografia.getAttribute("src")) {
        return;
    }

    previewFotografia.hidden = true;

    const erro = "Não foi possível abrir esta imagem. Escolha outra fotografia.";
    erroFotografia.textContent = erro;
    campoFotografia.setCustomValidity(erro);
});