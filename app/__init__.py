from flask import Flask
from .database import db
import os


def create_app():
    app = Flask(__name__)

    db_path = os.path.join(app.instance_path, 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    from .routes import api
    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    return app


