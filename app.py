from flask import Flask, render_template, request, session, jsonify, redirect, url_for

import os
import secrets
import mysql.connector
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# Carrega as configurações do ficheiro .env
load_dotenv()
# Indica onde estão os ficheiros HTML, CSS e JavaScript
app = Flask(
    __name__,
    template_folder="PartilhaLocal",
    static_folder="PartilhaLocal",
    static_url_path=""
)
# Chave utilizada para proteger as sessões.
app.secret_key = os.getenv("SECRET_KEY")

# Estabelece a ligação à base de dados MySQL.
def ligar_base_dados():
    ligacao = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    return ligacao


# Página inicial
@app.route("/")
@app.route("/index.html")
def inicio():
    return render_template("index.html")


# Página de registo

@app.route("/registo.html", methods=["GET", "POST"])
def registo():

    if request.method == "POST":
        nome = request.form.get("nome", "").strip()
        email = request.form.get("email", "").strip().lower()
        telefone = request.form.get("telefone", "").strip()
        localidade = request.form.get("localidade", "").strip()
        palavra_passe = request.form.get("palavra_passe", "")
        # Recebe a confirmação da palavra-passe.
        confirmar_passe = request.form.get("confirmar_passe", "")

        # Confirma que os campos obrigatórios foram preenchidos.
        if not nome or not email or len(palavra_passe) < 8:
            return "Preencha corretamente os campos obrigatórios.", 400
        # Verifica se as duas palavras-passe são iguais.
        if palavra_passe != confirmar_passe:
            return "As palavras-passe não são iguais.", 400

        # Protege a palavra-passe antes de a guardar.
        palavra_passe_protegida = generate_password_hash(palavra_passe)

        # Abre uma ligação à base de dados.
        ligacao = None

        try:
            ligacao = ligar_base_dados()
            cursor = ligacao.cursor()

            # Insere o novo utilizador na tabela.
            sql = """
                INSERT INTO utilizadores
                (nome, email, telefone, localidade, palavra_passe)
                VALUES (%s, %s, %s, %s, %s)
            """

            valores = (
                nome,
                email,
                telefone or None,
                localidade or None,
                palavra_passe_protegida
            )

            cursor.execute(sql, valores)
            ligacao.commit()

            return redirect(url_for("login"))

        except mysql.connector.IntegrityError:
            return "Este email já está registado.", 409

        except mysql.connector.Error:
            return "Não foi possível criar a conta.", 500

        finally:
            if ligacao is not None and ligacao.is_connected():
                ligacao.close()


       

    return render_template("registo.html")


# Página de login
@app.route("/login.html", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        palavra_passe = request.form.get("palavra_passe", "")

        if not email or not palavra_passe:
            return "Preencha o email e a palavra-passe.", 400

        ligacao = None

        try:
            # Procura o utilizador pelo email.
            ligacao = ligar_base_dados()
            cursor = ligacao.cursor(dictionary=True)

            sql = """
                SELECT id_utilizador, nome, palavra_passe
                FROM utilizadores
                WHERE email = %s
            """

            cursor.execute(sql, (email,))
            utilizador = cursor.fetchone()

            # Verifica a palavra-passe do utilizador.
            if utilizador:
                hash_guardado = utilizador["palavra_passe"]

                if hash_guardado.startswith(("scrypt:", "pbkdf2:")):
                    if check_password_hash(hash_guardado, palavra_passe):

                        # Guarda o utilizador na sessão.
                        session.clear()
                        session["id_utilizador"] = utilizador["id_utilizador"]
                        session["nome"] = utilizador["nome"]

                        return redirect(url_for("minha_conta"))

            return "Email ou palavra-passe incorretos.", 401

        except mysql.connector.Error:
            return "Não foi possível verificar o login.", 500

        finally:
            if ligacao is not None and ligacao.is_connected():
                ligacao.close()

    return render_template("login.html")



# Página para explorar materiais
@app.route("/explorar.html")
def explorar():
    return render_template("explorar.html")


# Página com os detalhes de um material
@app.route("/material.html")
def material():
    return render_template("material.html")


# Página para publicar materiais

@app.route("/publicar.html", methods=["GET", "POST"])
def publicar():

    # Apenas utilizadores autenticados podem publicar.
    if "id_utilizador" not in session:
        return "Precisa de iniciar sessão para publicar.", 401

    if request.method == "POST":
       
        nome = request.form.get("nome", "").strip()
        categoria = request.form.get("categoria", "").strip()

        localidade = " ".join(
            request.form.get("localidade", "").split()
        ).title()

        descricao = request.form.get("descricao", "").strip()


        # Recebe a fotografia enviada pelo formulário.
        fotografia = request.files.get("fotografia")
        dados_imagem = None
        extensao = None

        if fotografia and fotografia.filename:
            extensao = os.path.splitext(fotografia.filename)[1].lower()

            formatos = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp"
            }

            if (extensao not in formatos or
                    fotografia.mimetype != formatos[extensao]):
                return "Formato de fotografia inválido.", 400

            # Lê no máximo 5 MB, mais um byte para detetar excessos.
            dados_imagem = fotografia.read(5 * 1024 * 1024 + 1)

            if len(dados_imagem) > 5 * 1024 * 1024:
                return "A fotografia não pode ultrapassar 5 MB.", 400

            # Confirma o formato pelo conteúdo do ficheiro.
            jpeg = dados_imagem.startswith(b"\xff\xd8\xff")
            png = dados_imagem.startswith(b"\x89PNG\r\n\x1a\n")
            webp = dados_imagem.startswith(b"RIFF") and dados_imagem[8:12] == b"WEBP"

            valido = (
                extensao in (".jpg", ".jpeg") and jpeg or
                extensao == ".png" and png or
                extensao == ".webp" and webp
            )

            if not valido:
                return "O ficheiro não é uma imagem válida.", 400


        # Verifica os campos obrigatórios.
        if len(nome) < 3 or not categoria or len(localidade) < 2 or len(descricao) < 10:
            return "Preencha corretamente os campos.", 400

     
        # Procura a categoria escolhida.
        ligacao = None

        caminho_imagem = None
        ficheiro_guardado = None

        if dados_imagem is not None:
            # Cria a pasta, caso ainda não exista.
            pasta = os.path.join(app.static_folder, "imagens")
            os.makedirs(pasta, exist_ok=True)

            # Dá um nome único à fotografia.
            nome_ficheiro = secrets.token_hex(12) + extensao
            ficheiro_guardado = os.path.join(pasta, nome_ficheiro)

            with open(ficheiro_guardado, "wb") as ficheiro:
                ficheiro.write(dados_imagem)

            caminho_imagem = "imagens/" + nome_ficheiro


        try:
            ligacao = ligar_base_dados()
            cursor = ligacao.cursor()

            cursor.execute(
                "SELECT id_categoria FROM categorias WHERE nome_categoria = %s",
                (categoria,)
            )

            resultado = cursor.fetchone()
            if resultado is None:
                if ficheiro_guardado and os.path.exists(ficheiro_guardado):
                 os.remove(ficheiro_guardado)

                return "Categoria inválida.", 400

            
            id_categoria = resultado[0]

            # Guarda o material associado ao utilizador autenticado.
            sql = """
                INSERT INTO materiais
                (nome_material, descricao, estado, imagem,
                 id_categoria, id_utilizador, localidade)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            valores = (
                nome,
                descricao,
                "Disponível",
                caminho_imagem,
                id_categoria,
                session["id_utilizador"],
                localidade
            )

            cursor.execute(sql, valores)
            ligacao.commit()

            return redirect(url_for("explorar"))

        except mysql.connector.Error:
    # Apaga a fotografia caso o material não seja guardado.
            if ficheiro_guardado and os.path.exists(ficheiro_guardado):
             os.remove(ficheiro_guardado)

             return "Não foi possível publicar o material.", 500

        finally:
            if ligacao is not None and ligacao.is_connected():
                ligacao.close()


    return render_template("publicar.html")



# Área do utilizador
@app.route("/minha-conta")
def minha_conta():

    # Verifica se o utilizador iniciou sessão.
    if "id_utilizador" not in session:
        return "Precisa de iniciar sessão.", 401

    # Obtém os dados do utilizador da sessão.
    nome = session["nome"]
    id_utilizador = session["id_utilizador"]

    # Liga à base de dados.
    conexao = ligar_base_dados()
    cursor = conexao.cursor(dictionary=True)

    try:
        # Procura apenas os materiais deste utilizador.
        cursor.execute("""
            SELECT id_material, nome_material, localidade
            FROM materiais
            WHERE id_utilizador = %s
            ORDER BY id_material DESC
        """, (id_utilizador,))

        materiais = cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()

    # Envia o nome e os materiais para o HTML.
    return render_template(
        "minha-conta.html",
        nome=nome,
        materiais=materiais
    )

# Eliminar um material publicado pelo utilizador
@app.route("/eliminar-material/<int:id_material>", methods=["POST"])
def eliminar_material(id_material):

    # Verifica se o utilizador iniciou sessão.
    if "id_utilizador" not in session:
        return "Precisa de iniciar sessão.", 401

    ligacao = None
    cursor = None

    try:
        ligacao = ligar_base_dados()
        cursor = ligacao.cursor(dictionary=True)

        # Confirma que o material pertence ao utilizador.
        cursor.execute("""
            SELECT id_material
            FROM materiais
            WHERE id_material = %s AND id_utilizador = %s
        """, (id_material, session["id_utilizador"]))

        material = cursor.fetchone()

        if material is None:
            return "Material não encontrado ou sem autorização.", 404

        # Não elimina materiais com pedidos associados.
        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM pedidos_emprestimo
            WHERE id_material = %s
        """, (id_material,))

        resultado = cursor.fetchone()

        if resultado["total"] > 0:
            return "Este material tem pedidos associados e não pode ser eliminado.", 409

        # Elimina apenas o material do utilizador autenticado.
        cursor.execute("""
            DELETE FROM materiais
            WHERE id_material = %s AND id_utilizador = %s
        """, (id_material, session["id_utilizador"]))

        ligacao.commit()

        return redirect(url_for("minha_conta"))

    except mysql.connector.Error:
        if ligacao is not None:
            ligacao.rollback()

        return "Não foi possível eliminar o material.", 500

    finally:
        if cursor is not None:
            cursor.close()

        if ligacao is not None and ligacao.is_connected():
            ligacao.close()


# Terminar a sessão do utilizador
@app.route("/terminar-sessao", methods=["POST"])
def terminar_sessao():

    # Apaga os dados da sessão atual.
    session.clear()

    return redirect(url_for("inicio"))

# Disponibiliza os materiais guardados na base de dados.
@app.route("/api/materiais")
def listar_materiais():
    ligacao = None

    try:
        ligacao = ligar_base_dados()
        cursor = ligacao.cursor(dictionary=True)

        sql = """
            SELECT
                m.id_material AS id,
                m.nome_material AS nome,
                m.descricao,
                m.localidade,
                m.estado,
                m.imagem,
                c.nome_categoria AS categoria,
                u.nome AS proprietario
            FROM materiais AS m
            LEFT JOIN categorias AS c
                ON m.id_categoria = c.id_categoria
            LEFT JOIN utilizadores AS u
                ON m.id_utilizador = u.id_utilizador
            ORDER BY m.id_material DESC
        """

        cursor.execute(sql)
        materiais_bd = cursor.fetchall()

        return jsonify(materiais_bd)

    except mysql.connector.Error:
        return jsonify({"erro": "Não foi possível carregar os materiais."}), 500

    finally:
        if ligacao is not None and ligacao.is_connected():
            ligacao.close()

            # Página do chat de demonstração
@app.route("/chat.html")
def chat():
    return render_template("chat.html")

# Inicia o servidor Flask
# Deve ficar depois das funções acima
if __name__ == "__main__":
    app.run(debug=True)
