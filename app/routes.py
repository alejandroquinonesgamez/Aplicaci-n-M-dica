from flask import request, jsonify, render_template, Blueprint
from datetime import datetime
from sqlalchemy import func

from .database import db
from .models import User, WeightEntry
from .helpers import calculate_bmi, get_bmi_description


api = Blueprint('api', __name__)

USER_ID = 1


@api.route('/')
def index():
    return render_template('index.html')


@api.route('/api/user', methods=['GET'])
def get_user():
    user = User.query.get(USER_ID)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify({
        "nombre": user.nombre,
        "apellidos": user.apellidos,
        "fecha_nacimiento": user.fecha_nacimiento.isoformat(),
        "talla_m": user.talla_m
    })


@api.route('/api/user', methods=['POST'])
def create_or_update_user():
    data = request.json or {}
    user = User.query.get(USER_ID)

    if not user:
        user = User(
            id=USER_ID,
            nombre=data['nombre'],
            apellidos=data['apellidos'],
            fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date(),
            talla_m=float(data['talla_m'])
        )
        db.session.add(user)
    else:
        user.nombre = data['nombre']
        user.apellidos = data['apellidos']
        user.fecha_nacimiento = datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d').date()
        user.talla_m = float(data['talla_m'])

    db.session.commit()
    return jsonify({"message": "Usuario guardado"}), 200


@api.route('/api/weight', methods=['POST'])
def add_weight():
    data = request.json or {}
    user = User.query.get(USER_ID)
    if not user:
        return jsonify({"error": "Debe configurar el usuario primero"}), 400

    nuevo_peso = WeightEntry(
        user_id=USER_ID,
        peso_kg=float(data['peso_kg'])
    )
    db.session.add(nuevo_peso)
    db.session.commit()
    return jsonify({"message": "Peso registrado"}), 201


@api.route('/api/imc', methods=['GET'])
def get_current_imc():
    user = User.query.get(USER_ID)
    if not user:
        return jsonify({"error": "Usuario no configurado"}), 404

    ultimo_peso = WeightEntry.query.filter_by(user_id=USER_ID).order_by(WeightEntry.fecha_registro.desc()).first()
    if not ultimo_peso:
        return jsonify({"imc": 0, "description": "Sin registros de peso"}), 200

    imc = calculate_bmi(ultimo_peso.peso_kg, user.talla_m)
    description = get_bmi_description(imc)
    return jsonify({"imc": imc, "description": description})


@api.route('/api/stats', methods=['GET'])
def get_stats():
    num_pesajes = WeightEntry.query.filter_by(user_id=USER_ID).count()
    peso_max = db.session.query(func.max(WeightEntry.peso_kg)).filter_by(user_id=USER_ID).scalar()
    peso_min = db.session.query(func.min(WeightEntry.peso_kg)).filter_by(user_id=USER_ID).scalar()
    return jsonify({
        "num_pesajes": num_pesajes or 0,
        "peso_max": peso_max or 0,
        "peso_min": peso_min or 0
    })


