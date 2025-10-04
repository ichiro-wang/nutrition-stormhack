from flask import Blueprint, jsonify, request
from .models import db
from .models import User
from .services import process_and_save_nutrition_label

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
    if not data or 'username' not in data:
        return jsonify({"error": "Missing username"}), 400

    username = data['username']

    if User.query.filter_by(username=username).first():
        return jsonify({"error": f"Username '{username}' already exists."}), 409

    new_user = User(username=username)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201


@main.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user_profile(user_id):
    """
    Updates a user's profile data.
    """
    user = User.query.get_or_404(user_id)
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


@main.route('/api/scan-nutrition-label', methods=['POST'])
def scan_nutrition_label():
    """
    Accepts user_id, food_name, quantity, and an image of a nutrition label.
    Processes the image, saves the data, and returns the newly created nutrition log.
    """
    # --- Form data validation ---
    required_fields = ['user_id', 'quantity', 'food_name']
    for field in required_fields:
        if field not in request.form or not request.form.get(field).strip():
            return jsonify({"error": f"Missing or empty required field: {field}"}), 400

    if 'image' not in request.files or request.files['image'].filename == '':
        return jsonify({"error": "Missing or empty required file: image"}), 400

    try:
        user_id = int(request.form.get('user_id'))
        quantity = float(request.form.get('quantity'))
        if quantity <= 0:
            return jsonify({"error": "Quantity must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for user_id or quantity."}), 400

    food_name = request.form.get('food_name')
    image_file = request.files['image']

    try:
        new_label, error = process_and_save_nutrition_label(user_id, food_name, quantity, image_file)
        
        if error:
            return jsonify({"error": error}), 400

        # The `to_dict()` method is assumed to exist on the NutritionLabel model
        # to serialize the object to a dictionary for the JSON response.
        return jsonify(new_label.to_dict()), 201
    except Exception as e:
        # This will catch errors from the service, like User not found (404) or other processing errors.
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