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
# @app.route("/editar", methods=["POST"])
# def editar():
#     data = request.json
#     index = data["index"]
#     nuevo = data["data"]
#     print(REPO)

#     datos, sha = obtener_json()

#     datos[index] = nuevo

#     subir_json(datos, sha)

#     return jsonify({"status": "editado"})
@app.route("/editar", methods=["POST"])
def editar():
    try:
        data = request.json
        path = data["path"]
        id_buscar = data["id"]
        nuevo = data["content"]

        TOKEN = os.getenv("GITHUB_TOKEN")
        REPO = os.getenv("GITHUB_REPO")

        API_URL = f"https://api.github.com/repos/{REPO}/contents/{path}"

        headers = {
            "Authorization": f"token {TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        # 📥 Obtener archivo
        r = requests.get(API_URL, headers=headers)
        data_github = r.json()
        sha = data_github["sha"]

        contenido = base64.b64decode(
            data_github["content"]
        ).decode("utf-8")

        datos = json.loads(contenido)

        # ✏️ Buscar por ID
        encontrado = False
        for i, d in enumerate(datos):
            if d.get("id") == id_buscar:
                datos[i] = nuevo
                encontrado = True
                break

        if not encontrado:
            return jsonify({"error": "ID no encontrado"}), 404

        # 📤 Subir cambios
        contenido_str = json.dumps(datos, indent=2)
        contenido_b64 = base64.b64encode(
            contenido_str.encode("utf-8")
        ).decode("utf-8")

        body = {
            "message": f"Editado ID {id_buscar}",
            "content": contenido_b64,
            "sha": sha
        }

        requests.put(API_URL, headers=headers, json=body)

        return jsonify({"status": "ok"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/eliminar", methods=["POST"])
def eliminar():
    try:
        data = request.json
        path = data["path"]
        id_eliminar = data["id"]

        TOKEN = os.getenv("GITHUB_TOKEN")
        REPO = os.getenv("GITHUB_REPO")

        API_URL = f"https://api.github.com/repos/{REPO}/contents/{path}"

        headers = {
            "Authorization": f"token {TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        # 📥 Obtener archivo actual
        r = requests.get(API_URL, headers=headers)

        if r.status_code != 200:
            return jsonify({"error": "No se pudo leer archivo"}), 500

        data_github = r.json()
        sha = data_github["sha"]

        contenido = base64.b64decode(
            data_github["content"]
        ).decode("utf-8")

        datos = json.loads(contenido)

        # 🗑️ Filtrar (eliminar por ID)
        nuevos_datos = [d for d in datos if d.get("id") != id_eliminar]

        # ⚠️ Validar si realmente se eliminó algo
        if len(datos) == len(nuevos_datos):
            return jsonify({"error": "ID no encontrado"}), 404

        # 📤 Subir archivo actualizado
        contenido_str = json.dumps(nuevos_datos, indent=2)
        contenido_b64 = base64.b64encode(
            contenido_str.encode("utf-8")
        ).decode("utf-8")

        body = {
            "message": f"Eliminado ID {id_eliminar}",
            "content": contenido_b64,
            "sha": sha
        }

        r = requests.put(API_URL, headers=headers, json=body)

        if r.status_code not in [200, 201]:
            return jsonify({
                "error": "Error al subir",
                "github": r.json()
            }), 500

        return jsonify({"status": "eliminado correctamente"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ➕ GUARDAR
# @app.route("/guardar", methods=["POST"])
# def guardar():
#     nuevo = request.json

#     datos, sha = obtener_json()

#     datos.append(nuevo)

#     subir_json(datos, sha)

#     return jsonify({"status": "ok"})

# @app.route("/save", methods=["POST"])
# def save_file():
#     try:
#         data = request.json
#         path = data["path"]              # ej: data/data.json
#         content = data["content"]        # JSON (dict o list)

#         TOKEN = os.getenv("GITHUB_TOKEN")
#         REPO = os.getenv("GITHUB_REPO")  # usuario/repositorio

#         API_URL = f"https://api.github.com/repos/{REPO}/contents/{path}"

#         headers = {
#             "Authorization": f"token {TOKEN}",
#             "Accept": "application/vnd.github+json"
#         }

#         # 📥 Obtener archivo actual (para SHA)
#         r = requests.get(API_URL, headers=headers)

#         if r.status_code == 200:
#             data_github = r.json()
#             sha = data_github["sha"]
#         else:
#             sha = None  # si no existe el archivo

#         # 📤 Convertir contenido a base64
#         contenido_str = json.dumps(content, indent=2)
#         contenido_b64 = base64.b64encode(contenido_str.encode("utf-8")).decode("utf-8")

#         body = {
#             "message": f"Update {path}",
#             "content": contenido_b64
#         }

#         if sha:
#             body["sha"] = sha  # necesario para actualizar

#         # 🚀 Subir a GitHub
#         r = requests.put(API_URL, headers=headers, json=body)

#         if r.status_code not in [200, 201]:
#             return jsonify({
#                 "status": "error",
#                 "github_response": r.json()
#             }), 500

#         return jsonify({
#             "status": "guardado y subido correctamente"
#         })

#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "error": str(e)
#         }), 500
    
@app.route("/save", methods=["POST"])
def save_file():
    try:
        data = request.json
        path = data["path"]              # "data/data.json"
        nuevo_registro = data["content"] # 👈 SOLO 1 registro nuevo

        TOKEN = os.getenv("GITHUB_TOKEN")
        REPO = os.getenv("GITHUB_REPO")

        API_URL = f"https://api.github.com/repos/{REPO}/contents/{path}"

        headers = {
            "Authorization": f"token {TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        # 📥 1. Obtener archivo actual
        r = requests.get(API_URL, headers=headers)

        if r.status_code == 200:
            data_github = r.json()
            sha = data_github["sha"]

            contenido_actual = base64.b64decode(
                data_github["content"]
            ).decode("utf-8")

            datos = json.loads(contenido_actual)

        else:
            # si no existe, arrancamos vacío
            datos = []
            sha = None

        # ➕ 2. Agregar nuevo registro
        datos.append(nuevo_registro)

        # 📤 3. Subir archivo actualizado
        contenido_str = json.dumps(datos, indent=2)
        contenido_b64 = base64.b64encode(
            contenido_str.encode("utf-8")
        ).decode("utf-8")

        body = {
            "message": "Nuevo registro agregado",
            "content": contenido_b64
        }

        if sha:
            body["sha"] = sha

        r = requests.put(API_URL, headers=headers, json=body)

        if r.status_code not in [200, 201]:
            return jsonify({
                "status": "error",
                "github_response": r.json()
            }), 500

        return jsonify({
            "status": "registro agregado"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

# @app.route("/save", methods=["POST"])
# def save_file():
#     try:
#         #import os
#         #from git import Repo

#         data = request.json
#         log(f"data: {data}")
#         path = data["path"]
#         content = data["content"]

#         # 🔧 Normalizar path (clave para Render/Linux)
#         path = os.path.normpath(path).replace("\\", "/")

#         log(f"path recibido: {path}")

#         # 💾 Guardar archivo
#         with open(path, "w", encoding="utf-8") as f:
#             #f.write(content)
#             json.dump(content, f, indent=2)

#         # 🔥 Detectar repo correctamente (raíz o subcarpeta)
#         repo = Repo(path, search_parent_directories=True)
#         log(f"repo root: {repo.working_tree_dir}")

#         # 📌 Agregar SOLO el archivo modificado
#         #repo.git.add(path)
#         repo.git.add(A=True)

#         # 🧠 Evitar commit vacío
#         if repo.is_dirty(untracked_files=True):
#             repo.index.commit(f"Update {os.path.basename(path)}")
#             log("commit realizado")

#             # 🔐 Autenticación para push
#             token = os.getenv("GITHUB_TOKEN")
#             username = os.getenv("GITHUB_USERNAME")

#             origin = repo.remote(name="origin")
#             url = origin.url

#             # limpiar posibles errores de URL
#             url = url.replace(".git/", ".git")

#             url_auth = url.replace(
#                 "https://",
#                 f"https://{username}:{token}@"
#             )

#             #origin.set_url(url_auth)

#             # 🚀 Push
#             origin.push()
#             log("push realizado")

#         else:
#             log("no hay cambios para commitear")

#         return jsonify({
#             "status": "guardado y subido"
#         })

#     except Exception as e:
#         log(f"ERROR: {str(e)}")
#         return jsonify({
#             "status": "error",
#             "error": str(e)
#         }), 500
    
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