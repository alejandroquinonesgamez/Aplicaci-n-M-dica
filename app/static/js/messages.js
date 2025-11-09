/**
 * Archivo de mensajes para la interfaz de usuario
 * Contiene todos los textos que se muestran al usuario en JavaScript
 */

const MESSAGES = {
    errors: {
        saveWeight: 'Error al guardar el peso',
        saveUser: 'Error al guardar usuario',
        heightOutOfRange: 'La talla debe estar entre 0.4 y 2.72 metros',
        weightOutOfRange: 'El peso debe estar entre 2 y 650 kg',
        weightVariationExceeded: (maxAllowed, days) => 
            `La variación de peso no puede ser mayor a ${maxAllowed} kg (${days} día(s) x 5 kg/día)`,
        userMustBeConfigured: 'Debes configurar tu perfil primero',
    },
    texts: {
        greeting: (name) => `¡Hola, ${name}!`,
        noWeightRecords: 'Sin registros de peso',
    },
    // Descripciones completas de BMI (clasificación + descripción detallada)
    // Vinculadas directamente mediante diccionario, igual que en el backend
    bmiDescriptions: {
        underweight: 'Peso Bajo - Tu IMC está por debajo del rango considerado saludable. Es recomendable consultar con un profesional de la salud para evaluar tu situación nutricional.',
        normal: 'Peso Normal - Tu IMC está dentro del rango considerado saludable. Mantén una alimentación equilibrada y actividad física regular.',
        overweight: 'Sobrepeso - Tu IMC indica sobrepeso. Se recomienda adoptar hábitos saludables como una dieta balanceada y ejercicio regular. Consulta con un profesional de la salud para un plan personalizado.',
        obese_class_i: 'Obesidad Clase I - Tu IMC indica obesidad de grado I. Es importante adoptar cambios en el estilo de vida con supervisión médica. Una dieta equilibrada y actividad física regular pueden ayudar a mejorar tu salud.',
        obese_class_ii: 'Obesidad Clase II - Tu IMC indica obesidad de grado II. Se recomienda consultar urgentemente con un profesional de la salud para desarrollar un plan de tratamiento personalizado que incluya dieta, ejercicio y posiblemente apoyo médico.',
        obese_class_iii: 'Obesidad Clase III - Tu IMC indica obesidad de grado III (obesidad mórbida). Es fundamental buscar atención médica especializada para desarrollar un plan de tratamiento integral que priorice tu salud y bienestar.',
    }
};

