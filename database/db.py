from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
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

VIDEO_EXTENSIONS = {"mp4", "webm"}


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

class Registro(Base):
    __tablename__ = 'registro'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")


def _es_video(ruta):
    return ruta.rsplit(".", 1)[-1].lower() in VIDEO_EXTENSIONS

def get_ultimos_avistamientos(cantidad):
    session = SessionLocal()
    avistamientos = session.query(Avistamiento).order_by(Avistamiento.id.desc()).limit(cantidad).all()
    data = []
    for a in avistamientos:
        #La primera foto (no video) se usa como imagen del resumen
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