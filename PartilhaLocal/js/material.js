// Obtém o identificador da ligação, por exemplo: material.html?id=2.
const parametros = new URLSearchParams(window.location.search);
const idMaterial = parametros.get("id");

const material = materiais.find(function (item) {
    return item.id === idMaterial;
});

const conteudoMaterial = document.querySelector("#conteudo-material");
const mensagemMaterial = document.querySelector("#mensagem-material");

if (material) {
    // textContent insere os valores como texto, sem interpretar HTML.
    document.querySelector("#nome-material").textContent = material.nome;
    document.querySelector("#localidade-material").textContent = material.localidade;
    document.querySelector("#estado-material").textContent = material.estado;
    document.querySelector("#categoria-material").textContent = material.categoria;
    document.querySelector("#descricao-material").textContent = material.descricao;

    document.title = `${material.nome} | PartilhaLocal`;
    conteudoMaterial.hidden = false;
} else {
    mensagemMaterial.textContent =
        "Material não encontrado. Volte à lista e escolha um material.";
}