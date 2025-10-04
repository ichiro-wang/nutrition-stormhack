from flask import Blueprint, jsonify, request
import pytesseract
from PIL import Image
import re
import io
import os
from datetime import datetime
from .models import db, NutritionLabel
from .models import User
from werkzeug.utils import secure_filename

# Create a Blueprint for the app
main = Blueprint('main', __name__)

@main.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

def parse_nutrition_text(text):
    """
    Parses raw text from a nutrition label to extract key-value pairs.
    Uses regular expressions to find nutrient information.
    """
    nutrition_data = {}
    # Define regex patterns for various nutrients.
    # The patterns look for the nutrient name followed by a value, typically in grams (g) or milligrams (mg).
    # re.IGNORECASE makes the search case-insensitive.
    # ([\d.]+) captures numerical values, including decimals.
    patterns = {
        'calories': r'Calories\s+([\d.]+)',
        'fat': r'Total Fat\s+([\d.]+)g',
        'carbohydrate': r'Total Carbohydrate\s+([\d.]+)g',
        'protein': r'Protein\s+([\d.]+)g'
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                nutrition_data[key] = float(match.group(1))
            except ValueError:
                nutrition_data[key] = match.group(1)

    return nutrition_data

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
    Accepts an image of a nutrition label, scans it using Tesseract OCR,
    and returns the extracted text.
    It also accepts user data and quantity to calculate total consumed nutrients.
    """
    # --- Extract and validate user_id ---
    if 'user_id' not in request.form:
        return jsonify({"error": "Missing required field: user_id"}), 400
    try:
        user_id = int(request.form.get('user_id'))
        # Check if user exists
        User.query.get_or_404(user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for user_id."}), 400

    # --- Extract and validate quantity separately ---
    if 'quantity' not in request.form:
        return jsonify({"error": "Missing required field: quantity"}), 400
    try:
        quantity = float(request.form.get('quantity'))
        if quantity <= 0:
            return jsonify({"error": "Quantity must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format for quantity."}), 400

    # --- Extract and validate food_name ---
    if 'food_name' not in request.form or not request.form.get('food_name').strip():
        return jsonify({"error": "Missing required field: food_name"}), 400
    food_name = request.form.get('food_name')

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            image_bytes = file.read()
            # --- Save the image and create a URL ---
            filename = secure_filename(f"{datetime.utcnow().isoformat()}-{file.filename}".replace(":", "-"))
            upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            image_path = os.path.join(upload_folder, filename)
            with open(image_path, 'wb') as f:
                f.write(image_bytes)
            image_url = request.host_url + f'uploads/{filename}'

            image = Image.open(io.BytesIO(image_bytes))
            extracted_text = pytesseract.image_to_string(image)
            parsed_data = parse_nutrition_text(extracted_text)

            if parsed_data:
                calculated_totals = {}
                for key, value in parsed_data.items():
                    if isinstance(value, (int, float)):
                        calculated_totals[key] = round(value * quantity, 2)

                final_data = {
                    'user_id': user_id,
                    'food_name': food_name,
                    'quantity': quantity,
                    'nutrition_data': calculated_totals, # Stored as JSON
                    'date_logged': datetime.utcnow(),
                    'image_url': image_url
                }

                new_label = NutritionLabel(**final_data)
                db.session.add(new_label)
                db.session.commit()
                # Return the data that was just saved, including its new ID
                return jsonify(new_label.to_dict()), 200
            
            return jsonify({"message": "Could not parse nutrition data from image."}), 400
        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500

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