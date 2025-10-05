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
    nutrition_data2 = {}
    patterns = {
        'fat': r'Total Fat\s+([\d.]+)g',
        'protein': r'Protein\s+([\d.]+)g'
    }
    pattern2 ={
        'Serving Size g': r'Serving Size g \s+([\d.]+\s*\w+)',
        'Servings Size (Qty)': r'Servings Per Container Qty:\s+([\d.]+)', 
        'Calories': r'Calories\s+([\d.]+)'
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                nutrition_data[key] = float(match.group(1))
            except ValueError:
                nutrition_data[key] = match.group(1)
    
    for key, pattern in pattern2.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                nutrition_data2[key] = float(match.group(1))
            except ValueError:
                nutrition_data2[key] = match.group(1)

    return (nutrition_data, nutrition_data2)

def process_and_save_nutrition_label(user_id, food_name, quantity, image_file):
    """
    Processes an uploaded nutrition label image, saves it, extracts data,
    and stores it in the database.
    """
    # Check if user exists
    User.query.get_or_404(user_id)

    image_bytes = image_file.read()
    
    # --- Save the image and create a URL ---
    filename = secure_filename(f"{datetime.now().isoformat()}-{image_file.filename}".replace(":", "-"))
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
        return None, "Could not parse nutrition data frsom image."

    calculated_totals = {
        key: round(value * quantity, 2)
        for key, value in parsed_data[0].items()
        if isinstance(value, (int, float))
    }
    
    calculated_totals2 = {
        'Caloreies': parsed_data[1].get('Calories', 0) * quantity if isinstance(parsed_data[1].get('Calories', 0), (int, float)) else parsed_data[1].get('Calories', 0),
        'Serving Size g': parsed_data[1].get('Serving Size g', 'N/A'),
        'Servings Size (Qty)': parsed_data[1].get('Servings Per Container Qty', 'N/A')
    }
    
    new_label = NutritionLabel(
        user_id=user_id,
        food_name=food_name,
        quantity=quantity,
        nutrition_data=calculated_totals,
        nutrition_data2=calculated_totals2,
        date_logged=datetime.now(),
        image_url=image_url
    )

    db.session.add(new_label)
    db.session.commit()
    
    return new_label, None