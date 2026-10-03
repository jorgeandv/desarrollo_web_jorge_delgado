import re

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