const campoPesquisa = document.querySelector("#pesquisa-material");

const filtroLocalidade = document.querySelector("#filtro-localidade");

const cartoes = document.querySelectorAll(".pagina-explorar .card-material");

const mensagemResultado = document.querySelector("#resultado-pesquisa");

// Cria a função que prepara o texto para a pesquisa.
function normalizarTexto(texto) {

    const semEspacos = texto.trim();


    const minusculas = semEspacos.toLowerCase();


    const separado = minusculas.normalize("NFD");

    const semAcentos = separado.replace(/[\u0300-\u036f]/g, "");

    return semAcentos;
}

function filtrarMateriais() {
    const pesquisa = normalizarTexto(campoPesquisa.value);
    const localidade = filtroLocalidade.value;
    let quantidade = 0;
    cartoes.forEach(function (cartao) {
        // Lê e normaliza o nome guardado no atributo data-nome.
        const nome = normalizarTexto(cartao.dataset.nome);

        // Verifica se o nome contém o texto pesquisado; uma pesquisa vazia aceita todos.
        const correspondeNome = nome.includes(pesquisa);

        // Aceita todas as localidades quando a opção está vazia ou exige uma correspondência.
        const correspondeLocalidade = localidade === "" || cartao.dataset.localidade === localidade;

        // Exige que o cartão cumpra os dois critérios ao mesmo tempo.
        const mostrar = correspondeNome && correspondeLocalidade;

        // Esconde o cartão quando ele não corresponde aos critérios.
        cartao.hidden = !mostrar;


        if (mostrar) {

            quantidade += 1;
        }
    });

    // Verifica se a pesquisa ficou sem resultados.
    if (quantidade === 0) {

        mensagemResultado.textContent = "Nenhum material encontrado.";

    } else {

        mensagemResultado.textContent = `Materiais encontrados: ${quantidade}`;
    }
}

// Atualiza os resultados sempre que o visitante escreve ou limpa a pesquisa.
campoPesquisa.addEventListener("input", filtrarMateriais);

// Atualiza os resultados sempre que o visitante muda a localidade.
filtroLocalidade.addEventListener("change", filtrarMateriais);


filtrarMateriais();