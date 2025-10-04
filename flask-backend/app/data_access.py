from .models import db, User, NutritionLabel
from datetime import datetime

def get_user_by_id(user_id):
    """
    Retrieves a user from the database by their ID.

    Args:
        user_id (int): The ID of the user to retrieve.

    Returns:
        User: The User object if found, otherwise None.
    """
    return User.query.get(user_id)

def delete_user_by_id(user_id):
    """
    Deletes a user from the database by their ID.

    Args:
        user_id (int): The ID of the user to delete.

    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    user = User.query.get(user_id)
    if not user:
        return False
    try:
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        return False

def get_food_logs_by_date(target_date):
    """
    Retrieves all food logs for a specific date.
    """
    start_of_day = datetime.combine(target_date, datetime.min.time())
    end_of_day = datetime.combine(target_date, datetime.max.time())
    return NutritionLabel.query.filter(
        NutritionLabel.date_logged.between(start_of_day, end_of_day)
    ).all()
