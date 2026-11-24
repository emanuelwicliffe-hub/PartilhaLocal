
const listaMateriais = document.querySelector(".lista-materiais");
const campoPesquisa = document.querySelector("#pesquisa-material");
const filtroLocalidade = document.querySelector("#filtro-localidade");
const mensagemResultado = document.querySelector("#resultado-pesquisa");

// Remove diferenças entre maiúsculas e acentos.
function normalizarTexto(texto) {
    return (texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Filtra os cartões apresentados na página.
function filtrarMateriais() {
    const pesquisa = normalizarTexto(campoPesquisa.value);
    const localidade = filtroLocalidade.value;
    const cartoes = document.querySelectorAll(".lista-materiais .card-material");

    let quantidade = 0;

    cartoes.forEach(function (cartao) {
        const correspondeNome = normalizarTexto(cartao.dataset.nome).includes(pesquisa);
        const correspondeLocalidade =
            localidade === "" || cartao.dataset.localidade === localidade;

        const mostrar = correspondeNome && correspondeLocalidade;

        cartao.hidden = !mostrar;

        if (mostrar) {
            quantidade++;
        }
    });

    mensagemResultado.textContent = quantidade === 0
        ? "Nenhum material encontrado."
        : `Materiais encontrados: ${quantidade}`;
}

// Cria os cartões com os materiais recebidos.
function mostrarMateriais(materiais) {
    listaMateriais.innerHTML = "";
    filtroLocalidade.innerHTML = '<option value="">Todas as localidades</option>';

    const localidades = new Set();

    materiais.forEach(function (material) {
        const cartao = document.createElement("div");
        cartao.className = "card-material";
        cartao.dataset.nome = material.nome;
        cartao.dataset.localidade = material.localidade || "";
        // Mostra a fotografia do material, quando existir.
        if (material.imagem) {
            const imagem = document.createElement("img");

            imagem.src = "/" + material.imagem;
            imagem.alt = material.nome;
            imagem.className = "imagem-material";

            cartao.append(imagem);
        }
        const titulo = document.createElement("h3");
        titulo.textContent = material.nome;

        const localidade = document.createElement("p");
        localidade.textContent = `Localidade: ${material.localidade || "Não indicada"}`;

        const estado = document.createElement("p");
        estado.textContent = `Estado: ${material.estado}`;

        const proprietario = document.createElement("p");
        proprietario.textContent = `Proprietário: ${material.proprietario || "Não indicado"}`;

        const link = document.createElement("a");
        link.className = "link-detalhes";
        link.href = `material.html?id=${encodeURIComponent(material.id)}`;
        link.textContent = `Ver detalhes: ${material.nome}`;

        cartao.append(titulo, localidade, estado, proprietario, link);
        listaMateriais.append(cartao);

        if (material.localidade) {
            localidades.add(material.localidade);
        }
    });

    localidades.forEach(function (localidade) {
        const opcao = document.createElement("option");
        opcao.value = localidade;
        opcao.textContent = localidade;
        filtroLocalidade.append(opcao);
    });

    filtrarMateriais();
}

// Carrega os materiais da base de dados através do Flask.
async function carregarMateriais() {
    mensagemResultado.textContent = "A carregar materiais...";

    try {
        const resposta = await fetch("/api/materiais");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar materiais.");
        }

        const materiais = await resposta.json();
        mostrarMateriais(materiais);

    } catch (erro) {
        mensagemResultado.textContent = "Não foi possível carregar os materiais.";
    }
}

campoPesquisa.addEventListener("input", filtrarMateriais);
filtroLocalidade.addEventListener("change", filtrarMateriais);

carregarMateriais();
