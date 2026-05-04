import requests
import base64
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # 👈 IMPORTANTE
from git import Repo

app = Flask(__name__)
CORS(app)  # 👈 ESTO SOLUCIONA TODO

TOKEN = os.environ.get("GITHUB_TOKEN")
REPO = os.environ.get("GITHUB_REPO")
FILE_PATH = os.environ.get("GITHUB_FILE")
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")

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

@app.route("/save", methods=["POST"])
def save_file():
    try:
        #import os
        #from git import Repo

        data = request.json
        log(f"data: {data}")
        path = data["path"]
        content = data["content"]

        # 🔧 Normalizar path (clave para Render/Linux)
        path = os.path.normpath(path).replace("\\", "/")

        log(f"path recibido: {path}")

        # 💾 Guardar archivo
        with open(path, "w", encoding="utf-8") as f:
            #f.write(content)
            json.dump(content, f, indent=2)

        # 🔥 Detectar repo correctamente (raíz o subcarpeta)
        repo = Repo(path, search_parent_directories=True)
        log(f"repo root: {repo.working_tree_dir}")

        # 📌 Agregar SOLO el archivo modificado
        #repo.git.add(path)
        repo.git.add(A=True)

        # 🧠 Evitar commit vacío
        if repo.is_dirty(untracked_files=True):
            repo.index.commit(f"Update {os.path.basename(path)}")
            log("commit realizado")

            # 🔐 Autenticación para push
            token = os.getenv("GITHUB_TOKEN")
            username = os.getenv("GITHUB_USERNAME")

            origin = repo.remote(name="origin")
            url = origin.url

            # limpiar posibles errores de URL
            url = url.replace(".git/", ".git")

            url_auth = url.replace(
                "https://",
                f"https://{username}:{token}@"
            )

            #origin.set_url(url_auth)

            # 🚀 Push
            origin.push()
            log("push realizado")

        else:
            log("no hay cambios para commitear")

        return jsonify({
            "status": "guardado y subido"
        })

    except Exception as e:
        log(f"ERROR: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500
    
logs_global = []

def log(msg):
    print(msg)
    logs_global.append(msg)

@app.route("/logs")
def get_logs():
    return jsonify(logs_global)

#app.run(host="0.0.0.0", port=10000)
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 5000)))