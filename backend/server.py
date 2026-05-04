import requests
import base64
import json
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

TOKEN = os.environ.get("GITHUB_TOKEN")
REPO = os.environ.get("GITHUB_REPO")
FILE_PATH = os.environ.get("GITHUB_FILE")

API_URL = f"https://api.github.com/repos/{REPO}/contents/{FILE_PATH}"

# 📥 Obtener archivo actual
def obtener_json():
    headers = {"Authorization": f"token {TOKEN}"}
    r = requests.get(API_URL, headers=headers)
    data = r.json()

    contenido = base64.b64decode(data["content"]).decode("utf-8")
    return json.loads(contenido), data["sha"]

# 📤 Subir archivo actualizado
def subir_json(nuevo_json, sha):
    headers = {"Authorization": f"token {TOKEN}"}

    contenido = base64.b64encode(
        json.dumps(nuevo_json, indent=2).encode("utf-8")
    ).decode("utf-8")

    body = {
        "message": "Actualización desde la app",
        "content": contenido,
        "sha": sha
    }

    r = requests.put(API_URL, headers=headers, json=body)
    return r.json()

# ✏️ EDITAR
@app.route("/editar", methods=["POST"])
def editar():
    data = request.json
    index = data["index"]
    nuevo = data["data"]
    print(REPO)

    datos, sha = obtener_json()

    datos[index] = nuevo

    subir_json(datos, sha)

    return jsonify({"status": "editado"})

# ➕ GUARDAR
@app.route("/guardar", methods=["POST"])
def guardar():
    nuevo = request.json

    datos, sha = obtener_json()

    datos.append(nuevo)

    subir_json(datos, sha)

    return jsonify({"status": "ok"})

app.run(host="0.0.0.0", port=10000)