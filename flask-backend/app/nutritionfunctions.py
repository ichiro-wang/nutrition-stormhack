def calcTDEE(weight, height, age, gender, activity_level):
    """
    Calculate Total Daily Energy Expenditure (TDEE) in calories using Mifflin–St Jeor equation.
    BMR (men) = 10W + 6.25H - 5A + 5
    BMR (women) = 10W + 6.25H - 5A - 161

    Parameters:
    weight (float): Weight in kilograms.
    height (float): Height in centimeters.
    age (float): Age in years.
    gender (str): 'M' or 'F'.
    activity_level (int): 1:'sedentary'
                          2: 'lightly active'
                          3: 'moderately active'
                          4: 'very active'
                          5: 'extra active'

    Returns:
    float: Total Daily Energy Expenditure in calories.
    """
    if gender == 'F':
        bmr = 10*weight + 6.25*height - 5*age - 161
    elif gender == 'M':
        bmr = 10*weight + 6.25*height - 5*age + 5
    else:
        raise ValueError("gender must be M or F")
    
    match activity_level:
        case 1:
            return bmr * 1.2
        case 2:
            return bmr * 1.375
        case 3:
            return bmr * 1.55
        case 4:
            return bmr * 1.725
        case 5:
            return bmr * 1.9
        case _:
            raise ValueError("activity_level must be between 1 and 5")  

    return -1

def calcMacronutrients(TDEE):
    """
    Calculate macronutrient distribution based on TDEE.

    Parameters:
    TDEE (float): Total Daily Energy Expenditure in calories.

    Returns:
    dict: Dictionary with grams of protein, carbs, and fats.
    """
    protein_calories = TDEE * 0.50
    carbs_calories = TDEE * 0.225
    fats_calories = TDEE * 0.275

    protein_grams = protein_calories / 4
    carbs_grams = carbs_calories / 4
    fats_grams = fats_calories / 9

    return {
        'protein_grams': protein_grams,
        'carbs_grams': carbs_grams,
        'fats_grams': fats_grams
    }
