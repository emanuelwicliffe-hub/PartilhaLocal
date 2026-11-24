const parametros = new URLSearchParams(window.location.search);
const idMaterial = parametros.get("id");

const nomeMaterial = document.querySelector("#material-chat");
const nomeProprietario = document.querySelector("#proprietario-chat");
const areaMensagens = document.querySelector("#mensagens-chat");
const formulario = document.querySelector("#form-chat");
const campoMensagem = document.querySelector("#mensagem-chat");

// Adiciona uma mensagem à conversa
function adicionarMensagem(texto, remetente) {
    const mensagem = document.createElement("p");
    mensagem.className = `mensagem-${remetente}`;
    mensagem.textContent = texto;

    areaMensagens.append(mensagem);

    // Faz scroll automático para a última mensagem
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

// Carrega o material escolhido
async function carregarConversa() {
    try {
        const resposta = await fetch("/api/materiais");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar materiais.");
        }

        const materiais = await resposta.json();

        const material = materiais.find(function (item) {
            return String(item.id) === idMaterial;
        });

        if (!material) {
            nomeMaterial.textContent = "Material não encontrado.";
            formulario.hidden = true;
            return;
        }

        const proprietario = material.proprietario || "Proprietário";

        nomeMaterial.textContent = `Material: ${material.nome}`;
        nomeProprietario.textContent = `Proprietário: ${proprietario}`;

        adicionarMensagem(
            `Olá! Sou ${proprietario}. Tens interesse em pedir o material emprestado?`,
            "proprietario"
        );

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const texto = campoMensagem.value.trim();

            if (!texto) {
                return;
            }

            adicionarMensagem(texto, "utilizador");
            campoMensagem.value = "";

            setTimeout(function () {
                adicionarMensagem(
                    "Claro! Podemos combinar os detalhes do empréstimo.",
                    "proprietario"
                );
            }, 1000);
        });

    } catch (erro) {
        nomeMaterial.textContent = "Não foi possível carregar a conversa.";
        formulario.hidden = true;
    }
}

carregarConversa();