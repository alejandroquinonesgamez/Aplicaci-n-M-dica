def calculate_bmi(peso_kg, talla_m):
    if talla_m <= 0:
        return 0
    return round(peso_kg / (talla_m ** 2), 1)


def get_bmi_description(imc):
    if imc < 18.5:
        return "Bajo peso"
    elif 18.5 <= imc < 25:
        return "Peso normal"
    elif 25 <= imc < 30:
        return "Sobrepeso"
    else:
        return "Obesidad"


