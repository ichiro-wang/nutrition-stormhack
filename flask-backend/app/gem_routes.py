from flask import Blueprint, jsonify, request
from .models import db
from .models import User, NutritionLabel
from datetime import datetime
from flask_login import login_user, logout_user, login_required, current_user
from .gemini_utils import get_gemini_response

gem_bp = Blueprint('gem_bp', __name__)

@gem_bp.route('/api/gemini', methods=['POST'])
@login_required
def gemini_chat():
    """
    Compares daily intake with recommended values and uses Gemini to grade and give feedback.
    Expects JSON:
    {
        "intake": {"calories": ..., "fats": ..., "carbs": ..., "protein": ...},
        "recommended": {"calories": ..., "fats": ..., "carbs": ..., "protein": ...}
    }
    """

    start_of_day = datetime.combine(datetime.now().date(), datetime.min.time())
    end_of_day = datetime.combine(datetime.now().date(), datetime.max.time())

    food_logs_today = NutritionLabel.query.filter(
        NutritionLabel.date_logged >= start_of_day,
        NutritionLabel.date_logged <= end_of_day, 
        NutritionLabel.user_id == current_user.id
    ).all()
    intake = {
        "calories": sum(int(f.nutrition_data2["calories"]) for f in food_logs_today),
        "fat": sum(f.nutrition_data["fat"] for f in food_logs_today),
        "carb": sum(f.nutrition_data["carb"] for f in food_logs_today),
        "protein": sum(f.nutrition_data["protein"] for f in food_logs_today)
    }

    recommended = {
        "calories": current_user.rec_calories,
        "fat": current_user.rec_fats,
        "carb": current_user.rec_carbs,
        "protein": current_user.rec_protein
    }

    if not intake or not recommended:
        return jsonify({"error": "Missing intake or recommended data"}), 400

    # Build the prompt for Gemini
    prompt = (
        f"Compare the following daily intake values with the recommended values:\n"
        f"Intake: Calories={intake['calories']}, Fat={intake['fat']}, Carb={intake['carb']}, Protein={intake['protein']}\n"
        f"Recommended: Calories={recommended['calories']}, Fats={recommended['fat']}, Carb={recommended['carb']}, Protein={recommended['protein']}\n"
        f"Grade the person based on how close their intake is to the recommended values (A-F scale), "
        f"and give specific feedback on what foods they should eat to reach the recommended values in two sentences."
        f"The final output should have maximum 3 lines and be in the format: Grade: <A-F>\nFeedback: <feedback here>."
    )

    try:
        result = get_gemini_response(prompt)
        return jsonify({"response": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500