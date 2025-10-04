from flask import Blueprint, jsonify, request
from .models import db
from .models import User
from .services import process_and_save_nutrition_label
from flask_login import login_user, logout_user, login_required, current_user
from .nutritionfunctions import calcTDEE, calcMacronutrients

# Create a Blueprint for the app
main = Blueprint('main', __name__)

@main.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200

@main.route('/api/signup', methods=['POST'])
def create_user():
    """
    Creates a new user.
    """
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    ACTIVITY_LEVELS = {
        'Sedentary': 1.2,
        'Lightly active': 1.375,
        'Moderately active': 1.55,
        'Very active': 1.725,
        'Extremely active': 1.9
    }

    try:
        if 'name' in data: name = data['name']
        if 'age' in data: age = int(data['age'])
        if 'weight' in data: weight = float(data['weight'])
        if 'height' in data: height = float(data['height'])
        if 'gender' in data:
            gender = str(data['gender']).upper()
            if gender not in ['M', 'F']:
                return jsonify({"error": "Gender must be 'M' or 'F'"}), 400
            gender = gender
        if 'activity_level' in data:
            activity_level_str = data['activity_level']
            if activity_level_str not in ACTIVITY_LEVELS:
                return jsonify({"error": f"Invalid activity_level. Must be one of: {list(ACTIVITY_LEVELS.keys())}"}), 400
            activity_level = ACTIVITY_LEVELS[activity_level_str]
        
        if User.query.filter_by(name=name).first():
            return jsonify({"error": f"Username '{name}' already exists."}), 409
        
        rec_calories = calcTDEE(weight, height, age, gender, activity_level)
        rec_macros = calcMacronutrients(rec_calories)
        rec_protein = rec_macros['protein_grams']
        rec_carbs = rec_macros['carbs_grams']
        rec_fats = rec_macros['fats_grams']
        
        new_user = User(name=name, age=age, weight=weight, height=height, gender=gender, activity_level=activity_level, rec_calories=rec_calories, rec_protein=rec_protein, rec_carbs=rec_carbs, rec_fats=rec_fats)

        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": f"User {new_user.id} profile created successfully."}), 200
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for one of the fields."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@main.route('/api/user/update', methods=['PUT'])
@login_required
def update_user_profile():
    """
    Updates a user's profile data.
    """
    user = current_user
    data = request.json

    ACTIVITY_LEVELS = {
        'Sedentary': 1.2,
        'Lightly active': 1.375,
        'Moderately active': 1.55,
        'Very active': 1.725,
        'Extremely active': 1.9
    }
    
    try:
        if 'age' in data: user.age = int(data['age'])
        if 'weight' in data: user.weight = float(data['weight'])
        if 'height' in data: user.height = float(data['height'])
        if 'gender' in data:
            gender = str(data['gender']).upper()
            if gender not in ['M', 'F']:
                return jsonify({"error": "Gender must be 'M' or 'F'"}), 400
            user.gender = gender
        if 'activity_level' in data:
            activity_level_str = data['activity_level']
            if activity_level_str not in ACTIVITY_LEVELS:
                return jsonify({"error": f"Invalid activity_level. Must be one of: {list(ACTIVITY_LEVELS.keys())}"}), 400
            user.activity_level_factor = ACTIVITY_LEVELS[activity_level_str]
            
        db.session.commit()
        return jsonify({"message": f"User {user_id} profile updated successfully."}), 200
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for one of the fields."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@main.route('/api/add-food', methods=['POST'])
@login_required
def addFood():
    """
    Accepts quantity, food_name, and an image of a nutrition label.
    Processes the image, saves the data, and returns the newly created nutrition log.
    """
    # --- Data validation ---
    data = request.form if request.form else request.json
    if not data:
        return jsonify({"error": "Missing request data"}), 400

    quantity = data.get('quantity')
    food_name = data.get('food_name')
    image_file = request.files.get('image')

    if not quantity or not food_name or not image_file:
        return jsonify({"error": "Missing required fields: quantity, food_name, or image"}), 400

    try:
        quantity = float(quantity)
        if quantity <= 0:
            return jsonify({"error": "Quantity must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for quantity."}), 400

    user_id = current_user.id

    try:
        new_label, error = process_and_save_nutrition_label(user_id, food_name, quantity, image_file)
        
        if error:
            return jsonify({"error": error}), 400

        return jsonify(new_label.to_dict()), 201
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@main.route('/api/data', methods=['POST'])
def create_data():
    data = request.json
    # Here you would typically process the data and save it to the database
    return jsonify({"message": "Data created", "data": data}), 201

@main.route('/api/data/<int:data_id>', methods=['GET'])
def get_data(data_id):
    # Here you would typically retrieve the data from the database
    return jsonify({"data_id": data_id, "data": "Sample data"}), 200

@main.route('/api/data/<int:data_id>', methods=['DELETE'])
def delete_data(data_id):
    # Here you would typically delete the data from the database
    return jsonify({"message": "Data deleted", "data_id": data_id}), 204

@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Missing name"}), 400
    user = User.query.filter_by(name=data['name']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    login_user(user)
    return jsonify({"message": f"Logged in as {user.name}"}), 200

@main.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200

@main.route('/api/current-user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({"name": current_user.name}), 200