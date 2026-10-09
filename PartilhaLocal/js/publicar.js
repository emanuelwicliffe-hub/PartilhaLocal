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

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    mensagemPublicacao.textContent = "Os campos estão preenchidos corretamente. Nesta demonstraçao, o material nao foi guardado nem publicado.";
});