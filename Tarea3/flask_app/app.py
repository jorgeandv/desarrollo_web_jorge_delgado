from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from utils.validations import validate_register_voluntario, validate_register_avistamiento, parse_fecha, parse_hora, validate_comentario
from database import db
from werkzeug.utils import secure_filename
from datetime import datetime
import hashlib
import filetype
import os
import uuid

#Se guardan las fotos y videos en uploads
UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y"

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#El tamaño maximo de lo que se puede subir en 16 MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000


#Portadaa
@app.route("/", methods=["GET"])
def index():
    #Ultimos 2 avistamientos agregados en la base de datos
    ultimos = db.get_ultimos_avistamientos(2)
    
    #Mensaje que deja otra ruta antes de redirigir aca (ej: avistamiento registrado) pop lo saca de la sesion, asi se muestra una sola vez
    mensaje = session.pop("mensaje", None)
    return render_template("index.html", ultimos=ultimos, mensaje=mensaje)


#Registrar voluntario
@app.route("/registrar-voluntario", methods=["GET", "POST"])
def registrar_voluntario():
    
    #Metodo POST
    if request.method == "POST":
        nombre = request.form.get("nombre")
        apellido = request.form.get("apellido")
        email = request.form.get("email")
        telefono = request.form.get("telefono")
        region = request.form.get("region")
        comuna = request.form.get("comuna")

        #Validar los datos en el servidor
        errores = validate_register_voluntario(nombre, apellido, email, telefono, region, comuna)
        
        #La comuna tiene que existir y pertenecer a la region elegida
        if not errores and not db.comuna_pertenece_a_region(int(comuna), int(region)):
            errores.append("Comuna")

        #Si no hay errores
        if not errores:
            #Entramos a la base de datos
            voluntario_id = db.create_voluntario(
                f"{nombre.strip()} {apellido.strip()}", email.strip(), telefono.strip(), int(comuna)
            )
            #Guarda el voluntario en la sesion 
            session["voluntario_id"] = voluntario_id
            return redirect(url_for("voluntario_registrado"))

        #Si hay errores se vuelve a mostrar el formulario con los mensajes
        return render_template("voluntario/registro.html", regiones=db.get_regiones(),
                               comunas=db.get_comunas(), errores=errores)

    #Metodo GET
    elif request.method == "GET":
        return render_template("voluntario/registro.html", regiones=db.get_regiones(),
                               comunas=db.get_comunas())


@app.route("/voluntario-registrado", methods=["GET"])
def voluntario_registrado():
    voluntario_id = session.get("voluntario_id", None)
    if not voluntario_id:
        return redirect(url_for("index"))

    voluntario = db.get_voluntario_by_id(voluntario_id)
    
    #Si existe en la base de datos pero no en la sesion
    if voluntario is None:
        return redirect(url_for("index"))
    
    #Se va a la pagina de exito
    return render_template("voluntario/exito.html", voluntario=voluntario)


#Registrar avistamiento
@app.route("/informar-avistamiento", methods=["GET", "POST"])
def informar_avistamiento():

    #Metodo POST
    if request.method == "POST":
        voluntario = request.form.get("voluntario")
        ave = request.form.get("ave")
        lugar = request.form.get("lugar")
        fecha = request.form.get("fecha")
        hora = request.form.get("hora")
        archivos = request.files.getlist("archivos")

        #Validar los datos en el servidor
        errores = validate_register_avistamiento(voluntario, ave, lugar, fecha, hora, archivos)

        #El voluntario y el ave tienen que existir en la base de datos (lo vemos con if)
        if "Voluntario" not in errores and db.get_voluntario_by_id(int(voluntario)) is None:
            errores.append("Voluntario")
        
        if "Ave" not in errores and db.get_ave_by_id(int(ave)) is None:
            errores.append("Ave")

        #Si no hay errores
        if not errores:
            #Se inserta el avistamiento en la base de datos
            #La fecha y la hora vienen separadas en el formulario, pero en la BD es una sola columna DATETIME
            fecha_hora = datetime.combine(parse_fecha(fecha), parse_hora(hora))
            avistamiento_id = db.create_avistamiento(int(voluntario), int(ave), fecha_hora, lugar.strip())

            #Para cada archivo
            for archivo in archivos:
                #Se genera un nombre aleatorio para el archivo
                _filename = hashlib.sha256(
                    secure_filename(archivo.filename).encode("utf-8")).hexdigest()
                _extension = filetype.guess(archivo).extension
                img_filename = f"{_filename}_{str(uuid.uuid4())}.{_extension}"

                #Se guarda el archivo en uploads
                archivo.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))

                #Se inserta en la tabla registro 
                #ruta_archivo es relativa a static/ para poder mostrarla con url_for('static', ...)
                nombre_original = secure_filename(archivo.filename) or img_filename
                db.create_registro(f"uploads/{img_filename}", nombre_original[:300], avistamiento_id)

            #Se guarda el mensaje en la sesion para mostrarlo en la portada
            session["mensaje"] = "¡Avistamiento registrado con éxito! Gracias por tu aporte."
            return redirect(url_for("index"))

        #Si hay errores se vuelve a mostrar el formulario con los mensajes
        return render_template("avistamiento/registro.html", voluntarios=db.get_voluntarios(),
                               aves=db.get_aves(), errores=errores)

    #Metodo GET
    elif request.method == "GET":
        return render_template("avistamiento/registro.html", voluntarios=db.get_voluntarios(),
                               aves=db.get_aves())


#Listado de avistamientos
@app.route("/listado-avistamientos", methods=["GET"])
def listado_avistamientos():
    PAGE_SIZE = 5

    #Los filtros vienen en la URL
    #type=int hace que cualquier valor no numerico se ignore (queda None o el valor por defecto)
    ave = request.args.get("ave", type=int)
    ordenar = request.args.get("ordenar", "fecha")
    direccion = request.args.get("direccion", "descendente")
    pagina = request.args.get("pagina", 1, type=int)

    #Solo se aceptan los valores que existen en el formulario (otra cosa se cambia por el valor por defecto)
    if ordenar not in ["fecha", "lugar"]:
        ordenar = "fecha"
    if direccion not in ["ascendente", "descendente"]:
        direccion = "descendente"

    #Cuantas paginas hay (minimo 1, aunque no haya avistamientos)
    total = db.contar_avistamientos(ave)
    total_paginas = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)

    #Si piden una pagina que no existe, se ajusta a la primera o a la ultima
    if pagina < 1:
        pagina = 1
    if pagina > total_paginas:
        pagina = total_paginas

    data = db.get_avistamientos(pagina, PAGE_SIZE, ave, ordenar, direccion)

    #filtros se usa para marcar las opciones elegidas en el formulario y para los links de Anterior/Siguiente
    filtros = {"ave": ave, "ordenar": ordenar, "direccion": direccion}
    return render_template("avistamiento/listado.html", data=data, aves=db.get_aves(),
                           filtros=filtros, pagina=pagina, total_paginas=total_paginas)


#Detalle de un avistamiento
@app.route("/avistamiento/<int:id>", methods=["GET"])
def detalle_avistamiento(id):
    avistamiento = db.get_avistamiento_by_id(id)
    #Si no existe se vuelve al listado
    if avistamiento is None:
        return redirect(url_for("listado_avistamientos"))
    return render_template("avistamiento/detalle.html", avistamiento=avistamiento)


#Comentarios
@app.route("/agregar-comentario", methods=["POST"])
def agregar_comentario():
    #Los datos llegan en formato JSON desde comentarios.js (fetch)
    data = request.get_json()

    nombre = data['nombre']
    texto = data['texto']
    avistamiento_id = data['avistamiento_id']

    #Validar los datos en el servidor
    errores = validate_comentario(nombre, texto, avistamiento_id)
    #El avistamiento tiene que existir en la base de datos (lo vemos con if)
    if "Avistamiento" not in errores and db.get_avistamiento_by_id(int(avistamiento_id)) is None:
        errores.append("Avistamiento")

    #Si hay errores, se responden para que comentarios.js los muestra
    if errores:
        return jsonify({"status": "error", "data": errores}), 400

    #Se inserta el comentario en la bd
    db.create_comentario(nombre.strip(), texto.strip(), datetime.now(), int(avistamiento_id))
    return jsonify({"status": "ok"})


#Estadisticas
@app.route("/stats", methods=["GET"])
def stats():
    return render_template("estadisticas/stats.html")

@app.route("/get-stats-data", methods=["GET"])
def get_stats_data():
    #Cantidad de avistamientos por dia, para el grafico de lineas
    data = db.get_avistamientos_por_dia()
    return jsonify(data)

@app.route("/get-stats-aves", methods=["GET"])
def get_stats_aves():
    #Cantidad de avistamientos por ave, para el grafico de torta
    data = db.get_avistamientos_por_ave()
    return jsonify(data)

@app.route("/get-stats-comunas", methods=["GET"])
def get_stats_comunas():
    #Cantidad de voluntarios por comuna, para el grafico de barras
    data = db.get_voluntarios_por_comuna()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)