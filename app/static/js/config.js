/**
 * Sistema de configuración compartida entre frontend y backend
 * Carga constantes de validación desde el backend con fallback local
 */

// Valores por defecto (fallback si el backend no está disponible)
const DEFAULT_VALIDATION_LIMITS = {
    height_min: 0.4,
    height_max: 2.72,
    weight_min: 2,
    weight_max: 650,
    birth_date_min: '1900-01-01',
    weight_variation_per_day: 5
};

// Configuración actual (se actualiza desde el backend)
let VALIDATION_LIMITS = { ...DEFAULT_VALIDATION_LIMITS };

/**
 * Carga la configuración desde el backend
 * @returns {Promise<boolean>} true si se cargó exitosamente
 */
async function loadConfigFromBackend() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const config = await response.json();
            VALIDATION_LIMITS = {
                height_min: config.validation_limits.height_min,
                height_max: config.validation_limits.height_max,
                weight_min: config.validation_limits.weight_min,
                weight_max: config.validation_limits.weight_max,
                birth_date_min: config.validation_limits.birth_date_min,
                weight_variation_per_day: config.validation_limits.weight_variation_per_day
            };
            return true;
        }
    } catch (error) {
        console.warn('No se pudo cargar configuración desde backend, usando valores por defecto:', error);
    }
    return false;
}

/**
 * Obtiene los límites de validación actuales
 * @returns {object} Objeto con los límites de validación
 */
function getValidationLimits() {
    return { ...VALIDATION_LIMITS };
}

/**
 * Valida la altura
 * @param {number} height_m - Altura en metros
 * @returns {boolean} true si es válida
 */
function validateHeight(height_m) {
    return height_m >= VALIDATION_LIMITS.height_min && 
           height_m <= VALIDATION_LIMITS.height_max;
}

/**
 * Valida el peso
 * @param {number} weight_kg - Peso en kilogramos
 * @returns {boolean} true si es válido
 */
function validateWeight(weight_kg) {
    return weight_kg >= VALIDATION_LIMITS.weight_min && 
           weight_kg <= VALIDATION_LIMITS.weight_max;
}

/**
 * Valida la fecha de nacimiento
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} true si es válida
 */
function validateBirthDate(dateString) {
    const date = new Date(dateString);
    const minDate = new Date(VALIDATION_LIMITS.birth_date_min);
    const maxDate = new Date();
    return date >= minDate && date <= maxDate;
}

/**
 * Calcula la variación máxima permitida de peso
 * @param {number} daysElapsed - Días transcurridos
 * @returns {number} Variación máxima permitida en kg
 */
function getMaxWeightVariation(daysElapsed) {
    return daysElapsed * VALIDATION_LIMITS.weight_variation_per_day;
}

// Inicializar configuración cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadConfigFromBackend();
    });
} else {
    loadConfigFromBackend();
}

// Exportar para uso global
window.AppConfig = {
    getValidationLimits,
    validateHeight,
    validateWeight,
    validateBirthDate,
    getMaxWeightVariation,
    loadConfigFromBackend
};

