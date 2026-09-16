# PartilhaLocal

Plataforma em desenvolvimento para facilitar a partilha e o empréstimo de materiais entre pessoas da mesma comunidade.

## Objetivo

O PartilhaLocal pretende aproximar pessoas que têm materiais disponíveis de quem precisa de os utilizar temporariamente, incentivando a reutilização e o consumo responsável.

## Estado do projeto

O projeto encontra-se na fase de desenvolvimento do **front-end**, a parte visual com que o utilizador interage. A prioridade é criar e ajustar todas as páginas antes de implementar o **back-end**, responsável pelo processamento e pela ligação à base de dados.

### Já desenvolvido

- Estrutura inicial da página principal em HTML.
- Cabeçalho com logótipo e menu de navegação.
- Secção de apresentação com botões para ver e publicar materiais.
- Secções de vantagens e materiais em destaque.
- Estilos em CSS e efeito de movimento nas caixas ao passar o rato.
- Regras de adaptação a ecrãs pequenos, ainda em revisão.
- Base de dados MySQL criada separadamente, segundo o registo de desenvolvimento.
- Relatório do projeto em fase de revisão e conclusão.

Os materiais apresentados na página são exemplos definidos no HTML. A interface ainda não está ligada ao MySQL. As ligações do menu e os botões estão em construção; alguns ainda usam `#` como destino provisório.

## Tecnologias

| Tecnologia | Utilização | Estado |
| --- | --- | --- |
| HTML5 | Estrutura e conteúdo das páginas | Em utilização |
| CSS3 | Cores, disposição dos elementos e adaptação a diferentes ecrãs | Em utilização |
| JavaScript | Interações e filtros no navegador | Planeado |
| MySQL | Armazenamento de utilizadores, materiais e pedidos | Base criada; integração pendente |
| MySQL Workbench | Administração e consulta da base de dados | Utilizado na preparação da base |
| Tecnologia de back-end | Processamento de dados, autenticação e comunicação com o MySQL | A definir |

## Estrutura inicial dos ficheiros

```text
PartilhaLocal/
├── index.html
├── css/
│   └── style.css
└── README.md
```

- `index.html`: página inicial do projeto.
- `css/style.css`: estilos da página e regras para ecrãs pequenos.
- `README.md`: apresentação, instruções e estado do projeto.

Esta estrutura corresponde aos ficheiros de front-end apresentados até ao momento. Será atualizada à medida que forem adicionadas páginas e outros recursos.

## Como abrir o front-end

1. Guarda o ficheiro `index.html` na pasta principal do projeto.
2. Cria uma pasta chamada `css` e coloca nela o ficheiro `style.css`.
3. Abre o ficheiro `index.html` num navegador.
4. Depois de alterares o HTML ou o CSS, guarda os ficheiros e atualiza a página no navegador.

Nesta fase, não é necessário instalar dependências, iniciar o MySQL ou ter acesso a um alojamento para visualizar a página.

### Verificações manuais

- Confirmar que o CSS é carregado e que as cores e os espaços aparecem corretamente.
- Reduzir a largura da janela para verificar a organização do menu e das caixas.
- Passar o rato sobre as caixas para verificar o efeito de movimento.
- Testar as ligações à medida que forem implementadas.

## Páginas previstas

| Página | Finalidade |
| --- | --- |
| Início | Apresentar a plataforma, as suas vantagens e alguns materiais |
| Explorar | Consultar materiais e pesquisar por categoria ou localidade |
| Detalhes do material | Mostrar fotografia, descrição, disponibilidade e opção de pedido |
| Entrar | Apresentar o formulário de acesso à conta |
| Criar conta | Apresentar o formulário de registo |
| Publicar material | Recolher os dados de um material para empréstimo |
| Minha conta | Organizar dados pessoais, materiais publicados e pedidos |
| Como funciona | Explicar o processo de empréstimo |
| Sobre nós | Apresentar o projeto e os seus objetivos |
| Contacto | Disponibilizar informações e um formulário de contacto |

Durante o desenvolvimento do front-end, serão usados dados de exemplo. O registo de contas, a gravação de materiais e o envio de pedidos reais serão implementados na fase de back-end.

## Base de dados

A base de dados foi criada com o nome `partilhalocal` e inclui quatro tabelas principais:

| Tabela | Finalidade |
| --- | --- |
| `utilizadores` | Guardar os dados das pessoas registadas |
| `categorias` | Organizar os materiais por tipo |
| `materiais` | Guardar os dados dos objetos disponíveis para empréstimo |
| `pedidos_emprestimo` | Registar os pedidos de empréstimo |

A estrutura e as relações serão revistas antes da integração. Este README não inclui instruções de importação, porque ainda não foi definido um ficheiro SQL de instalação para acompanhar o projeto.

## Próximas etapas

### 1. Concluir o front-end

- [ ] Rever os estilos da página inicial e resolver regras duplicadas.
- [ ] Verificar a apresentação no computador e no telemóvel.
- [ ] Acrescentar o rodapé.
- [ ] Criar as restantes páginas.
- [ ] Ligar o menu e os botões aos respetivos destinos.
- [ ] Preparar os formulários e os seus campos.
- [ ] Acrescentar interações em JavaScript com dados de exemplo.

### 2. Implementar o back-end

- [ ] Escolher e configurar a tecnologia do servidor.
- [ ] Configurar a ligação ao MySQL.
- [ ] Implementar registo, entrada e saída da conta.
- [ ] Guardar palavras-passe através de um mecanismo adequado de hash.
- [ ] Implementar publicação, edição e remoção de materiais.
- [ ] Implementar pedidos, aceitação, recusa e registo da devolução.
- [ ] Validar dados no servidor e controlar as permissões de cada utilizador.

### 3. Preparar a entrega

- [ ] Testar o percurso completo de um empréstimo.
- [ ] Atualizar o relatório, as imagens e a calendarização com o trabalho realizado.
- [ ] Documentar a instalação do back-end e da base de dados.
- [ ] Preparar a publicação, caso faça parte dos requisitos da entrega.

## Desenvolvimento e aprendizagem

O projeto é desenvolvido passo a passo, com explicações por blocos e comentários no código para ajudar a compreender cada linha. A documentação será atualizada conforme as funcionalidades forem concluídas.
