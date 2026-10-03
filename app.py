from flask import Flask, render_template, request, redirect, url_for, session
from utils.validations import validate_register_voluntario
from database import db

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y"


#Portada
@app.route("/", methods=["GET"])
def index():
    #los ultimos 2 avistamientos agregados en la base de datos
    ultimos = db.get_ultimos_avistamientos(2)
    return render_template("index.html", ultimos=ultimos)


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
        #La comuna tiene que existir y pertenecer a la region elegida, sino no tiene sentido
        if not errores and not db.comuna_pertenece_a_region(int(comuna), int(region)):
            errores.append("Comuna")

        #No hay errores
        if not errores:
            #Se mete a la base de datos
            voluntario_id = db.create_voluntario(
                f"{nombre.strip()} {apellido.strip()}", email.strip(), telefono.strip(), int(comuna)
            )
            #Guardar el voluntario en la sesion (para la pagina de exito)
            session["voluntario_id"] = voluntario_id
            return redirect(url_for("voluntario_registrado"))

        #Si hay errores, se vuelve a mostrar el formulario con los mensajes
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
    #Existe en la base de datos pero no en la sesion
    if voluntario is None:
        return redirect(url_for("index"))
    #Se va a la pagina de exito
    return render_template("voluntario/exito.html", voluntario=voluntario)


if __name__ == "__main__":
    app.run(debug=True)