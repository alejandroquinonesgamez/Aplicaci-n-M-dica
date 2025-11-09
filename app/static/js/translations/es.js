/**
 * Traducciones en español
 * Archivo de mensajes para la interfaz de usuario en español
 */

const es = {
    errors: {
        save_weight: 'Error al guardar el peso',
        save_user: 'Error al guardar usuario',
        height_out_of_range: 'La talla debe estar entre 0.4 y 2.72 metros',
        weight_out_of_range: 'El peso debe estar entre 2 y 650 kg',
        user_must_be_configured: 'Debes configurar tu perfil primero',
        weightVariationExceeded: (maxAllowed, days) => {
            if (days === 1) {
                return `El peso no puede variar más de ${maxAllowed} kg en 1 día`;
            } else {
                return `El peso no puede variar más de ${maxAllowed} kg en ${days} días`;
            }
        }
    },
    texts: {
        no_weight_records: 'Sin registros de peso',
        greeting: (name) => `¡Hola, ${name}!`
    },
    bmi_descriptions: {
        underweight: 'Peso Bajo - Tu IMC está por debajo del rango considerado saludable. Es recomendable consultar con un profesional de la salud para evaluar tu situación nutricional.',
        normal: 'Peso Normal - Tu IMC está dentro del rango considerado saludable. Mantén una alimentación equilibrada y actividad física regular.',
        overweight: 'Sobrepeso - Tu IMC indica sobrepeso. Se recomienda adoptar hábitos saludables como una dieta balanceada y ejercicio regular. Consulta con un profesional de la salud para un plan personalizado.',
        obese_class_i: 'Obesidad Clase I - Tu IMC indica obesidad de grado I. Es importante adoptar cambios en el estilo de vida con supervisión médica. Una dieta equilibrada y actividad física regular pueden ayudar a mejorar tu salud.',
        obese_class_ii: 'Obesidad Clase II - Tu IMC indica obesidad de grado II. Se recomienda consultar urgentemente con un profesional de la salud para desarrollar un plan de tratamiento personalizado que incluya dieta, ejercicio y posiblemente apoyo médico.',
        obese_class_iii: 'Obesidad Clase III - Tu IMC indica obesidad de grado III (obesidad mórbida). Es fundamental buscar atención médica especializada para desarrollar un plan de tratamiento integral que priorice tu salud y bienestar.',
    }
};

// Exportar para uso en módulos ES6 o como variable global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = es;
} else {
    window.translations = window.translations || {};
    window.translations.es = es;
}

