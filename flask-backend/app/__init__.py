from flask import Flask
from .models import db

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('config')

    # Initialize extensions
    db.init_app(app)

    # Import and register blueprints
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .user_routes import user_bp as user_blueprint
    app.register_blueprint(user_blueprint)

    return app