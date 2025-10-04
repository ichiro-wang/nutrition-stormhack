from flask import Blueprint, jsonify, request
import pytesseract
from PIL import Image
import re
import io
from .models import db, NutritionLabel


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
        'fat_g': r'Total Fat\s+([\d.]+)g',
        'carbohydrate_g': r'Total Carbohydrate\s+([\d.]+)g',
        'protein_g': r'Protein\s+([\d.]+)g'
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                nutrition_data[key] = float(match.group(1))
            except ValueError:
                nutrition_data[key] = match.group(1)

    return nutrition_data

@main.route('/api/scan-nutrition-label', methods=['POST'])
def scan_nutrition_label():
    """
    Accepts an image of a nutrition label, scans it using Tesseract OCR,
    and returns the extracted text.
    It also accepts a 'quantity' to calculate total consumed nutrients.
    """
    # --- 1. Extract and validate all form data ---
    form_data = request.form
    required_fields = ['user_id', 'quantity', 'age', 'weight', 'height']
    for field in required_fields:
        if field not in form_data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    try:
        user_id = int(form_data.get('user_id'))
        quantity = float(form_data.get('quantity'))
        age = int(form_data.get('age'))
        weight = float(form_data.get('weight'))
        height = float(form_data.get('height'))
        gender = str(form_data.get('gender', 'unspecified'))
        
        if quantity <= 0:
            return jsonify({"error": "Quantity must be a positive number"}), 400
    except ValueError:
        return jsonify({"error": "Invalid data format for one of the fields (user_id, quantity, age, weight, height, gender)."}), 400

    # --- 2. Process the image ---
    # (This part remains the same)

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            # --- 3. Scan image and parse text ---
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            extracted_text = pytesseract.image_to_string(image)
            parsed_data = parse_nutrition_text(extracted_text)

            if parsed_data:
                # --- 4. Calculate totals and prepare DB record ---
                calculated_totals = {}
                for key, value in parsed_data.items():
                    if isinstance(value, (int, float)):
                        calculated_totals[key] = round(value * quantity, 2)

                # Combine user data with calculated nutrition data
                final_data = {
                    'user_id': user_id,
                    'age': age,
                    'weight': weight,
                    'height': height,
                    'gender': gender,
                    **calculated_totals
                }

                # --- 5. Save to database and return response ---
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