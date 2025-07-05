from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    # Obtenir le chemin du dossier racine du projet
    project_root = os.path.dirname(os.path.dirname(__file__))
    
    app = Flask(
        __name__,
        template_folder=os.path.join(project_root, 'templates'),
        static_folder=os.path.join(project_root, 'static'),
        static_url_path='/static'
    )

    # Configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialisation des extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        # Importation des modèles et des routes
        from . import routes
        db.create_all()  # Crée les tables de la DB

    return app 