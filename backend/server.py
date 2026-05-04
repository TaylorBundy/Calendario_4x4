from flask import Flask, request, jsonify
import json

app = Flask(__name__)

ARCHIVO = "data/data.json"

@app.route("/guardar", methods=["POST"])
def guardar():
    nuevo = request.json

    with open(ARCHIVO, "r") as f:
        datos = json.load(f)

    datos.append(nuevo)

    with open(ARCHIVO, "w") as f:
        json.dump(datos, f, indent=2)

    return jsonify({"status": "ok"})

@app.route("/data.json")
def data():
    with open(ARCHIVO) as f:
        return f.read()

app.run(host="0.0.0.0", port=10000)