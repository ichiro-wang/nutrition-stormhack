from flask import Blueprint, jsonify
from .models import db, User, NutritionLabel
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy


user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Retrieves a user's data by user ID.
    """
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@user_bp.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Deletes a user from the database by user ID.
    Also deletes associated nutrition labels due to cascading delete.
    """
    user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User with ID {user_id} and all associated data has been deleted."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred during deletion: {str(e)}"}), 500
#
@user_bp.route('/api/foodlog/date/<string:date_str>', methods=['GET'])
def get_food_by_date(date_str):
    """
    Get a list of food that entered the database on a specific date.
    Date format should be YYYY-MM-DD.
    """
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

    start_of_day = datetime.combine(target_date, datetime.min.time())
    end_of_day = datetime.combine(target_date, datetime.max.time())

    food_logs = NutritionLabel.query.filter(
        NutritionLabel.date_logged >= start_of_day,
        NutritionLabel.date_logged <= end_of_day
    ).all()

    return jsonify([log.to_dict() for log in food_logs]), 200

@user_bp.route('/api/user/<int:user_id>/foodlogs', methods=['GET'])
def get_all_user_food(user_id):
    """
    Retrieves all food logs for a specific user.
    """
    food_logs = NutritionLabel.query.filter_by(user_id=user_id).all()
    if not food_logs:
        return jsonify({"message": f"No food logs found for user ID {user_id}."}), 404

    results = []
    for log in food_logs:
        log_dict = log.to_dict()
        
        # Transform nutrition_data from a dictionary to a list of objects
        if 'nutrition_data' in log_dict and isinstance(log_dict['nutrition_data'], dict):
            transformed_nutrition_data = [
                {"name": key.replace('_', ' ').title(), "value": value}
                for key, value in log_dict['nutrition_data'].items()
            ]
            log_dict['nutrition_data'] = transformed_nutrition_data
        
        results.append(log_dict)

    return jsonify(results), 200
