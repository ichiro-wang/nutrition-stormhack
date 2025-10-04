from flask import Flask
from flask_login import LoginManager
from .models import User, db

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)

    # Import and register blueprints
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .user_routes import user_bp as user_blueprint
    app.register_blueprint(user_blueprint)

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(name):
        return User.query.filter_by(name=name).first()

    return app