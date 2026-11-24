
// Obtém o ID do material a partir do endereço.
const parametros = new URLSearchParams(window.location.search);
const idMaterial = parametros.get("id");

const conteudoMaterial = document.querySelector("#conteudo-material");
const mensagemMaterial = document.querySelector("#mensagem-material");

// Consulta os materiais disponíveis no MySQL através do Flask.
async function carregarMaterial() {
    if (!idMaterial) {
        mensagemMaterial.textContent = "Material não encontrado.";
        return;
    }

    try {
        const resposta = await fetch("/api/materiais");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar os materiais.");
        }

        const materiais = await resposta.json();

        // Procura o material que corresponde ao ID do endereço.
        const material = materiais.find(function (item) {
            return String(item.id) === idMaterial;
        });

        if (!material) {
            mensagemMaterial.textContent =
                "Material não encontrado. Volte à lista e escolha um material.";
            return;
        }

        // Apresenta os dados recebidos da base de dados.
        document.querySelector("#nome-material").textContent = material.nome;
        document.querySelector("#localidade-material").textContent =
            material.localidade || "Não indicada";
        document.querySelector("#estado-material").textContent = material.estado;
        document.querySelector("#categoria-material").textContent = material.categoria;
        document.querySelector("#descricao-material").textContent = material.descricao;

        document.title = `${material.nome} | PartilhaLocal`;


        mensagemMaterial.textContent = "";

        // Mostra os detalhes do material.
        conteudoMaterial.hidden = false;

        // Abre o chat do material selecionado.
        const botaoPedido = document.querySelector("#botao-pedido");

        botaoPedido.addEventListener("click", function () {
            window.location.href = `/chat.html?id=${encodeURIComponent(material.id)}`;
        });

    } catch (erro) {
        mensagemMaterial.textContent =
            "Não foi possível carregar os detalhes do material.";
    }
}

carregarMaterial();
