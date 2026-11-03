from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

#Extensiones de video permitidas (para distinguir fotos de videos al mostrarlos)
VIDEO_EXTENSIONS = {"mp4", "webm", "mov", "avi", "mkv"}


class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    voluntarios = relationship("Voluntario", back_populates="comuna")

class Voluntario(Base):
    __tablename__ = 'voluntario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)

    comuna = relationship("Comuna", back_populates="voluntarios")
    avistamientos = relationship("Avistamiento", back_populates="voluntario")

class Ave(Base):
    __tablename__ = 'ave'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)

    avistamientos = relationship("Avistamiento", back_populates="ave")

class Avistamiento(Base):
    __tablename__ = 'avistamiento'

    id = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey('voluntario.id'), nullable=False)
    ave_id = Column(Integer, ForeignKey('ave.id'), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)

    voluntario = relationship("Voluntario", back_populates="avistamientos")
    ave = relationship("Ave", back_populates="avistamientos")
    registros = relationship("Registro", back_populates="avistamiento")
    comentarios = relationship("Comentario", back_populates="avistamiento")

class Registro(Base):
    __tablename__ = 'registro'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")

class Comentario(Base):
    __tablename__ = 'comentario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False, default=func.now())
    avistamiento_id = Column(Integer, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="comentarios")


def _es_video(ruta):
    return ruta.rsplit(".", 1)[-1].lower() in VIDEO_EXTENSIONS

def get_ultimos_avistamientos(cantidad):
    session = SessionLocal()
    avistamientos = session.query(Avistamiento).order_by(Avistamiento.id.desc()).limit(cantidad).all()
    data = []
    for a in avistamientos:
        #Uasmos la primera foto como imagen del resumen
        foto = None
        for r in a.registros:
            if not _es_video(r.ruta_archivo):
                foto = r.ruta_archivo
                break
        data.append({"id": a.id, "ave": a.ave.nombre, "lugar": a.lugar, "fecha_hora": a.fecha_hora, "voluntario": a.voluntario.nombre,
            "n_archivos": len(a.registros), "foto": foto})
    session.close()
    return data


def get_regiones():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.id).all()
    session.close()
    return regiones

def get_comunas():
    session = SessionLocal()
    comunas = session.query(Comuna).order_by(Comuna.nombre).all()
    session.close()
    return comunas

def comuna_pertenece_a_region(comuna_id, region_id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=comuna_id, region_id=region_id).first()
    session.close()
    return comuna is not None

def get_voluntario_by_id(id):
    session = SessionLocal()
    voluntario = session.query(Voluntario).filter_by(id=id).first()
    session.close()
    return voluntario

def create_voluntario(nombre, email, telefono, comuna_id):
    session = SessionLocal()
    nuevo = Voluntario(nombre=nombre, email=email, telefono=telefono, fecha_registro=datetime.now(), comuna_id=comuna_id)
    session.add(nuevo)
    session.commit()
    voluntario_id = nuevo.id
    session.close()
    return voluntario_id

def get_voluntarios():
    #Para el <select> de voluntario del formulario de avistamiento
    session = SessionLocal()
    voluntarios = session.query(Voluntario).order_by(Voluntario.nombre).all()
    session.close()
    return voluntarios

def get_aves():
    #Para el <select> de ave del formulario de avistamiento y del filtro del listado
    session = SessionLocal()
    aves = session.query(Ave).order_by(Ave.nombre).all()
    session.close()
    return aves

def get_ave_by_id(id):
    session = SessionLocal()
    ave = session.query(Ave).filter_by(id=id).first()
    session.close()
    return ave

def create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar):
    session = SessionLocal()
    #La descripcion queda en NULL porque el form de mi tarea 1 no la tenia
    nuevo = Avistamiento(voluntario_id=voluntario_id, ave_id=ave_id, fecha_hora=fecha_hora, lugar=lugar, descripcion=None)
    session.add(nuevo)
    session.commit()
    #Se devuelve el id para poder asociarle los registros 
    avistamiento_id = nuevo.id
    session.close()
    return avistamiento_id

def create_registro(ruta_archivo, nombre_archivo, avistamiento_id):
    session = SessionLocal()
    nuevo = Registro(ruta_archivo=ruta_archivo, nombre_archivo=nombre_archivo, avistamiento_id=avistamiento_id)
    session.add(nuevo)
    session.commit()
    session.close()

def contar_avistamientos(ave_id=None):
    #Cuantos avistamientos hay (todos, o solo los de un ave). Sirve para saber cuantas paginas hay
    session = SessionLocal()
    query = session.query(Avistamiento)
    if ave_id:
        query = query.filter_by(ave_id=ave_id)
    total = query.count()
    session.close()
    return total

def get_avistamientos(pagina, page_size, ave_id=None, ordenar="fecha", direccion="descendente"):
    #Devuelve los avistamientos de UNA pagina del listado
    session = SessionLocal()
    query = session.query(Avistamiento)

    #Filtrar por ave (si se eligio una)
    if ave_id:
        query = query.filter_by(ave_id=ave_id)

    #Ordenar por fecha o por lugar, ascendente o descendente
    if ordenar == "lugar":
        columna = Avistamiento.lugar
    else:
        columna = Avistamiento.fecha_hora
    if direccion == "ascendente":
        query = query.order_by(columna.asc(), Avistamiento.id.asc())
    else:
        query = query.order_by(columna.desc(), Avistamiento.id.desc())

    #Paginacion: se salta las paginas anteriores (offset) y trae solo page_size (limit)
    avistamientos = query.offset((pagina - 1) * page_size).limit(page_size).all()

    #Se arma la informacion antes de cerrar la sesion (despues ya no se puede acceder a a.ave, etc)
    data = []
    for a in avistamientos:
        data.append({"id": a.id, "ave": a.ave.nombre, "lugar": a.lugar, "fecha_hora": a.fecha_hora})
    session.close()
    return data

def get_avistamiento_by_id(id):
    #Toda la informacion de un avistamiento, para la pagina de detalle
    session = SessionLocal()
    a = session.query(Avistamiento).filter_by(id=id).first()
    if a is None:
        session.close()
        return None

    archivos = []
    for r in a.registros:
        archivos.append({"ruta": r.ruta_archivo, "nombre": r.nombre_archivo, "es_video": _es_video(r.ruta_archivo)})

    data = {
        "id": a.id,
        "ave": a.ave.nombre,
        "lugar": a.lugar,
        "fecha_hora": a.fecha_hora,
        "voluntario": a.voluntario.nombre,
        "comuna": a.voluntario.comuna.nombre,
        "region": a.voluntario.comuna.region.nombre.strip(),
        "archivos": archivos
    }
    session.close()
    return data


#Comentarios
def create_comentario(nombre, texto, fecha, avistamiento_id):
    session = SessionLocal()
    nuevo = Comentario(nombre=nombre, texto=texto, fecha=fecha, avistamiento_id=avistamiento_id)
    session.add(nuevo)
    session.commit()
    session.close()


#Estadisticas
def get_avistamientos_por_dia():
    session = SessionLocal()
    avistamientos = session.query(Avistamiento.fecha_hora).all()
    session.close()

    #Se cuenta cuantos avistamientos hay en cada dia
    conteo = {}
    for (fecha_hora,) in avistamientos:
        dia = fecha_hora.strftime("%Y-%m-%d")
        if dia not in conteo:
            conteo[dia] = 0
        conteo[dia] += 1

    #Se ordena por dia para que el grafico vaya de izquierda a derecha
    data = []
    for dia in sorted(conteo):
        data.append({"date": dia, "count": conteo[dia]})
    return data

def get_avistamientos_por_ave():
    session = SessionLocal()
    avistamientos = session.query(Avistamiento).all()

    #Se cuenta cuantos avistamientos tiene cada ave
    #(se usa el nombre del ave porque en la BD no existe un campo "tipo")
    conteo = {}
    for a in avistamientos:
        nombre = a.ave.nombre
        if nombre not in conteo:
            conteo[nombre] = 0
        conteo[nombre] += 1
    session.close()

    data = []
    for nombre in conteo:
        data.append({"ave": nombre, "count": conteo[nombre]})
    return data

def get_voluntarios_por_comuna():
    session = SessionLocal()
    voluntarios = session.query(Voluntario).all()

    #Se cuenta cuantos voluntarios hay en cada comuna
    #(solo aparecen las comunas que tienen al menos un voluntario)
    conteo = {}
    for v in voluntarios:
        nombre = v.comuna.nombre
        if nombre not in conteo:
            conteo[nombre] = 0
        conteo[nombre] += 1
    session.close()

    data = []
    for nombre in conteo:
        data.append({"comuna": nombre, "count": conteo[nombre]})
    return data
