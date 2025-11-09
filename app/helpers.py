from .translations import get_bmi_complete_description


def calculate_bmi(weight_kg, height_m):
    if height_m <= 0:
        return 0
    return round(weight_kg / (height_m ** 2), 1)


def get_bmi_description(bmi):
    """Devuelve la clasificación de BMI con su descripción detallada"""
    # Diccionario que vincula el rango de BMI con la clave de descripción
    # La descripción está vinculada directamente a la clasificación
    if bmi < 18.5:
        key = "underweight"
    elif 18.5 <= bmi < 25:
        key = "normal"
    elif 25 <= bmi < 30:
        key = "overweight"
    elif 30 <= bmi < 35:
        key = "obese_class_i"
    elif 35 <= bmi < 40:
        key = "obese_class_ii"
    else:  # bmi >= 40
        key = "obese_class_iii"
    
    return get_bmi_complete_description(key)


