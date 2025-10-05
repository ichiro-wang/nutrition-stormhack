from PIL import Image
import pytesseract
import re
import io
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import request

from .models import db, NutritionLabel, User

def parse_nutrition_text(text):
    """
    Parses raw text from a nutrition label to extract key-value pairs.
    Uses regular expressions to find nutrient information.
    """
    nutrition_data = {}
    patterns = {
        'Serving Size g': r'Serving Size g \s+([\s.]+\s*\w+)',
        'Servings Size (Qty)': r'Servings Per Container Qty:\s+([\s.]+)', 
        'calories': r'Calories\s+([\d.]+)',
        'fat': r'Total Fat\s+([\d.]+)g',
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

def process_and_save_nutrition_label(user_id, food_name, quantity, image_file):
    """
    Processes an uploaded nutrition label image, saves it, extracts data,
    and stores it in the database.
    """
    # Check if user exists
    User.query.get_or_404(user_id)

    image_bytes = image_file.read()
    
    # --- Save the image and create a URL ---
    filename = secure_filename(f"{datetime.utcnow().isoformat()}-{image_file.filename}".replace(":", "-"))
    upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    image_path = os.path.join(upload_folder, filename)
    with open(image_path, 'wb') as f:
        f.write(image_bytes)
    image_url = request.host_url + f'uploads/{filename}'

    image = Image.open(io.BytesIO(image_bytes))
    extracted_text = pytesseract.image_to_string(image)
    parsed_data = parse_nutrition_text(extracted_text)

    if not parsed_data:
        return None, "Could not parse nutrition data from image."

    calculated_totals = {
        key: round(value * quantity, 2)
        for key, value in parsed_data.items()
        if isinstance(value, (int, float))
    }

    new_label = NutritionLabel(
        user_id=user_id,
        food_name=food_name,
        quantity=quantity,
        nutrition_data=calculated_totals,
        date_logged=datetime.utcnow(),
        image_url=image_url
    )

    db.session.add(new_label)
    db.session.commit()
    
    return new_label, None