
import os
import mysql.connector
from dotenv import load_dotenv

# Carrega as informações do ficheiro .env
load_dotenv()

try:
    # Estabelece a ligação ao MySQL
    ligacao = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    print("Ligação ao MySQL realizada com sucesso!")

    # Fecha a ligação
    ligacao.close()

except mysql.connector.Error as erro:
    print("Erro na ligação ao MySQL:", erro)
