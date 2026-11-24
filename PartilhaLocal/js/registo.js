
const formulario = document.getElementById("form-registo");

formulario.addEventListener("submit", function (evento) {

    // Obtém os valores das duas palavras-passe.
    const palavraPasse = document.getElementById("palavra_passe").value;
    const confirmarPasse = document.getElementById("confirmar_passe").value;

    // Impede o envio apenas quando são diferentes.
    if (palavraPasse !== confirmarPasse) {
        evento.preventDefault();
        alert("As palavras-passe não são iguais!");
    }

});
