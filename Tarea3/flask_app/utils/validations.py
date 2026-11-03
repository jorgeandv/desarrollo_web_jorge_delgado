import re
from datetime import date, datetime
import filetype

def validate_nombre(value):
    if not value:
        return False
    largo = len(value.strip())
    return 2 <= largo <= 100 and bool(re.fullmatch(r"[a-zA-ZÀ-ÿñÑ\s]{2,}", value))

def validate_apellido(value):
    if not value:
        return False
    largo = len(value.strip())
    return 2 <= largo <= 100 and bool(re.fullmatch(r"[a-zA-ZÀ-ÿñÑ\s]{2,}", value))

def validate_email(value):
    if not value:
        return False
    largo = len(value.strip())
    return 6 <= largo <= 80 and bool(re.fullmatch(r"[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}", value, re.ASCII))

def validate_telefono(value):
    if not value:
        return False
    largo = len(value.strip())
    return 8 <= largo <= 15 and bool(re.fullmatch(r"[0-9]+", value))

def validate_region(value):
    return bool(value) and bool(re.fullmatch(r"[0-9]{1,9}", value))

def validate_comuna(value):
    return bool(value) and bool(re.fullmatch(r"[0-9]{1,9}", value))


def validate_register_voluntario(nombre, apellido, email, telefono, region, comuna):
    #Retorna la lista de campos invalidos (vacia si todo esta bien)
    invalid_inputs = []
    if not validate_nombre(nombre):
        invalid_inputs.append("Nombre")
    if not validate_apellido(apellido):
        invalid_inputs.append("Apellido")
    if not validate_email(email):
        invalid_inputs.append("Email")
    if not validate_telefono(telefono):
        invalid_inputs.append("Telefono")
    if not validate_region(region):
        invalid_inputs.append("Region")
    if not validate_comuna(comuna):
        invalid_inputs.append("Comuna")
    return invalid_inputs


# Validaciones del formulario de avistamiento
MAX_ARCHIVOS = 5


def validate_id(value):
    #Para los <select> de voluntario y ave: tiene que ser un id numerico
    return bool(value) and bool(re.fullmatch(r"[0-9]{1,9}", value))

def validate_lugar(value):
    if not value:
        return False
    largo = len(value.strip())
    return 2 <= largo <= 200 and bool(re.fullmatch(r"[a-zA-ZÀ-ÿñÑ\s]{2,}", value))

def parse_fecha(value):
    #Devuelve un date si el formato es AAAA-MM-DD, o None si no
    if not value or not re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value):
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None

def validate_fecha(value):
    fecha = parse_fecha(value)
    if fecha is None:
        return False
    hoy = date.today()
    #Se aguantan hasta 15 años atras y no puede ser una fecha futura
    try:
        fecha_minima = hoy.replace(year=hoy.year - 15)
    except ValueError:
        #Caso 29 de febrero lol
        fecha_minima = hoy.replace(year=hoy.year - 15, day=28)
    return fecha_minima <= fecha <= hoy

def parse_hora(value):
    #Devuelve un time si el formato es HH:MM, o None si no
    if not value or not re.fullmatch(r"[0-9]{2}:[0-9]{2}", value):
        return None
    try:
        return datetime.strptime(value, "%H:%M").time()
    except ValueError:
        return None

def validate_hora(value):
    return parse_hora(value) is not None

def validate_archivo(archivo):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "mp4", "webm", "mov", "avi", "mkv"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif", "image/webp",
                         "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"}

    if archivo is None:
        return False

    if archivo.filename == "":
        return False

    # filetype revisa el contenido REAL del archivo (no el nombre),
    # asi no basta con renombrar un .exe a .jpg para pasar la validacion
    ftype_guess = filetype.guess(archivo)
    # si no reconoce el tipo, no es una imagen ni un video valido
    if ftype_guess is None:
        return False
    # check file extension
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True


def validate_archivos(archivos):
    #Tiene que haber entre 1 y 5 archivos
    #(si no se elige ninguno, el navegador igual manda uno vacio y validate_archivo lo rechaza)
    if len(archivos) < 1 or len(archivos) > MAX_ARCHIVOS:
        return False
    #Todos los archivos tienen que ser validos
    for archivo in archivos:
        if not validate_archivo(archivo):
            return False
    return True


def validate_register_avistamiento(voluntario, ave, lugar, fecha, hora, archivos):
    #Retorna la lista de campos invalidos (vacia si todo esta bien)
    invalid_inputs = []
    if not validate_id(voluntario):
        invalid_inputs.append("Voluntario")
    if not validate_id(ave):
        invalid_inputs.append("Ave")
    if not validate_lugar(lugar):
        invalid_inputs.append("Lugar")
    if not validate_fecha(fecha):
        invalid_inputs.append("Fecha")
    if not validate_hora(hora):
        invalid_inputs.append("Hora")
    if not validate_archivos(archivos):
        invalid_inputs.append("Archivos")
    return invalid_inputs


# Validaciones del formulario de comentario
def validate_nombre_comentarista(value):
    if not value:
        return False
    largo = len(value.strip())
    return 3 <= largo <= 50

def validate_texto_comentario(value):
    if not value:
        return False
    largo = len(value.strip())
    #Minimo 5 (enunciado) y maximo 300 (en la BD es VARCHAR(300))
    return 5 <= largo <= 300

def validate_comentario(nombre, texto, avistamiento_id):
    #Retorna la lista de campos invalidos (vacia si todo esta bien)
    invalid_inputs = []
    if not validate_nombre_comentarista(nombre):
        invalid_inputs.append("Nombre")
    if not validate_texto_comentario(texto):
        invalid_inputs.append("Comentario")
    if not validate_id(str(avistamiento_id)):
        invalid_inputs.append("Avistamiento")
    return invalid_inputs
