from flask import Blueprint, jsonify, request
from .models import db
from .models import User, NutritionLabel
from flask_login import login_user, logout_user, login_required, current_user

gem_bp = Blueprint('gem_bp', __name__)