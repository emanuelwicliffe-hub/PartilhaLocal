
async function carregarDestaques() {
    const lista = document.getElementById("materiais-destaque");

    try {
        const resposta = await fetch("/api/materiais");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar materiais");
        }

        const materiais = await resposta.json();

        lista.innerHTML = "";

        if (materiais.length === 0) {
            lista.textContent = "Ainda não existem materiais publicados.";
            return;
        }

        materiais
            .sort((a, b) => b.id - a.id)
            .slice(0, 3)
            .forEach(material => {
                const card = document.createElement("div");
                card.className = "card-material";

                const imagem = document.createElement("img");
                imagem.src = material.imagem
                    ? "/" + material.imagem.replace(/^\/+/, "")
                    : "/imagens/berbequim.webp";
                imagem.alt = material.nome;

                const nome = document.createElement("h3");
                nome.textContent = material.nome;

                const localidade = document.createElement("p");
                localidade.textContent = "Localidade: " + material.localidade;

                const detalhes = document.createElement("a");
                detalhes.href = "/material.html?id=" + material.id;
                detalhes.textContent = "Ver detalhes";

                card.append(imagem, nome, localidade, detalhes);
                lista.appendChild(card);
            });

    } catch (erro) {
        console.error(erro);
        lista.textContent = "Não foi possível carregar os materiais.";
    }
}

carregarDestaques();
