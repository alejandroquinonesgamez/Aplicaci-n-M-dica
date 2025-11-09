/**
 * Sistema de traducciones
 * Carga las traducciones del idioma activo configurado en el backend
 * Funciona de forma similar al sistema de backend
 */
const ACTIVE_LANGUAGE = window.APP_CONFIG?.activeLanguage || 'es';
const AVAILABLE_LANGUAGES = window.APP_CONFIG?.availableLanguages || ['es'];

// Objeto global de mensajes
let MESSAGES = {};

/**
 * Carga las traducciones del idioma especificado
 * Primero intenta cargar desde el backend, luego desde archivos locales
 * @param {string} langCode - Código del idioma
 */
async function loadTranslations(langCode = ACTIVE_LANGUAGE) {
    // Validar que el idioma esté disponible
    if (!AVAILABLE_LANGUAGES.includes(langCode)) {
        console.warn(`Idioma '${langCode}' no disponible. Usando idioma configurado: ${ACTIVE_LANGUAGE}`);
        langCode = ACTIVE_LANGUAGE;
    }
    
    // Obtener traducciones locales del idioma especificado
    const localTranslations = window.translations?.[langCode];
    
    // Intentar cargar desde el backend primero
    try {
        const response = await fetch('/api/messages');
        if (response.ok) {
            const backendMessages = await response.json();
            // Fusionar mensajes del backend con funciones helper locales
            MESSAGES = {
                errors: {
                    ...backendMessages.errors,
                    weightVariationExceeded: localTranslations?.errors?.weightVariationExceeded
                },
                texts: {
                    ...backendMessages.texts,
                    greeting: localTranslations?.texts?.greeting
                },
                bmi_descriptions: backendMessages.bmi_descriptions
            };
            return;
        }
    } catch (error) {
        console.warn('No se pudieron cargar las traducciones del backend:', error);
    }
    
    // Si falla el backend, usar traducciones locales
    if (localTranslations) {
        MESSAGES = {
            errors: {
                ...localTranslations.errors
            },
            texts: {
                ...localTranslations.texts
            },
            bmi_descriptions: {
                ...localTranslations.bmi_descriptions
            }
        };
    } else {
        console.error(`No se encontraron traducciones para '${langCode}'.`);
        if (langCode !== ACTIVE_LANGUAGE && window.translations?.[ACTIVE_LANGUAGE]) {
            return loadTranslations(ACTIVE_LANGUAGE);
        }
    }
}

/**
 * Inicializa el sistema de traducciones
 */
function initTranslations() {
    loadTranslations(ACTIVE_LANGUAGE);
}

// Inicializar traducciones cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
} else {
    initTranslations();
}

// Exportar funciones públicas
window.TranslationManager = {
    getMessages: () => MESSAGES,
    getActiveLanguage: () => ACTIVE_LANGUAGE,
    getAvailableLanguages: () => AVAILABLE_LANGUAGES
};

