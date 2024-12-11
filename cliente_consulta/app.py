from flask import Flask, request
from flask_cors import CORS
import json

# pip install flask-cors
app = Flask("Minha API")
CORS(app)  # ativa cors para todas rotas


@app.route("/consulta", methods={"GET"})
def consulta_cliente():
    documento = request.args.get("doc")
    registro = dados(documento)
    return registro


@app.route("/cadastro", methods={"POST"})
def cadastrar():
    payload = request.json
    cpf = payload.get("cpf")
    valores = payload.get("dados")
    
    # Verifica se o CPF já existe
    if verificar_cpf_existente(cpf):
        return "Erro: CPF já cadastrado.", 400  # Retorna um erro se o CPF já existe
    
    salvar_dados(cpf, valores)
    return "Dados armazenados", 200


def carregar_arquivo():
    # Caminho de onde o arquivo está salvo
    caminho_arquivo = "cliente_consulta\data\dados.json"
    try:
        with open(caminho_arquivo, "r") as arq:
            return json.load(arq)
    except FileNotFoundError:
        # Se o arquivo não existir, retorna um dicionário vazio
        return {}


def gravar_arquivo(dados):
    caminho_arquivo = "cliente_consulta\data\dados.json"
    try:
        with open(caminho_arquivo, "w") as arq:
            json.dump(dados, arq, indent=4, ensure_ascii=False)
        return "Dados armazenados"
    except Exception:
        return "Falha ao carregar o arquivo"


def salvar_dados(cpf, registro):
    dados_pessoas = carregar_arquivo()

    # Adiciona o novo registro se o CPF não existir
    dados_pessoas[cpf] = registro
    
    # Ordena os dados pelo nome do cliente ignorando maiúsculas e minúsculas
    dados_pessoas_ordenados = {k: v for k, v in sorted(dados_pessoas.items(), key=lambda item: item[1]['nome'].lower())}
    gravar_arquivo(dados_pessoas_ordenados)



def verificar_cpf_existente(cpf):
    dados_pessoas = carregar_arquivo()
    return cpf in dados_pessoas  # Retorna True se o CPF já existir


def dados(cpf):
    dados_pessoas = carregar_arquivo()

    if cpf in dados_pessoas:
        return dados_pessoas[cpf]  # Retorna os dados do cliente como JSON
    else:
        # Se o CPF não for encontrado, retorna um JSON com uma chave 'message'
        return {"message": "Registro não encontrado"}


if __name__ == "__main__":
    app.run(debug=True)
