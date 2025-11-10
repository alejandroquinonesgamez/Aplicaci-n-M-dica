from flask import Flask
from flask_cors import CORS
from .storage import MemoryStorage


def create_app():
    app = Flask(__name__)
    app.storage = MemoryStorage()

    # Configurar CORS para permitir llamadas desde el frontend
    # En desarrollo, permite cualquier origen
    # En producción, deberías restringir a dominios específicos
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    # Registrar blueprints
    from .views import views
    from .routes import api
    
    app.register_blueprint(views)
    app.register_blueprint(api)

    return app


