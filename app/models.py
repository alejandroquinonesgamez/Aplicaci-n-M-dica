from .database import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    talla_m = db.Column(db.Float, nullable=False)

    pesajes = db.relationship('WeightEntry', backref='user', lazy=True, cascade="all, delete-orphan")


class WeightEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    peso_kg = db.Column(db.Float, nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


