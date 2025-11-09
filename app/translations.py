"""
Gestor de traducciones
Proporciona funciones de acceso a las traducciones del idioma activo
"""
from .languages import es
from .config import ACTIVE_LANGUAGE, AVAILABLE_LANGUAGES

# Mapeo de códigos de idioma a módulos de traducción
# Se construye dinámicamente basado en AVAILABLE_LANGUAGES de config.py
LANGUAGE_MODULES = {
    'es': es,
}

# Obtener el módulo de traducción del idioma activo
_current_language = LANGUAGE_MODULES.get(ACTIVE_LANGUAGE, es)

# Importar todas las traducciones del idioma activo
ERRORS = _current_language.ERRORS
MESSAGES = _current_language.MESSAGES
BMI_COMPLETE_DESCRIPTIONS = _current_language.BMI_COMPLETE_DESCRIPTIONS
BMI_DESCRIPTIONS = _current_language.BMI_DESCRIPTIONS
DAYS_TEXT_MAP = _current_language.DAYS_TEXT_MAP
DAYS_TEXT_TEMPLATE = _current_language.DAYS_TEXT_TEMPLATE
TEXTS = _current_language.TEXTS
FRONTEND_MESSAGES = _current_language.FRONTEND_MESSAGES
HTML_TEXTS = _current_language.HTML_TEXTS


def get_error(key, **kwargs):
    """Obtiene un mensaje de error formateado"""
    message = ERRORS.get(key, key)
    if kwargs:
        return message.format(**kwargs)
    return message


def get_message(key):
    """Obtiene un mensaje de éxito"""
    return MESSAGES.get(key, key)


def get_bmi_description(key):
    """Obtiene la descripción de BMI (clasificación)"""
    return BMI_DESCRIPTIONS.get(key, key)


def get_bmi_complete_description(key):
    """Obtiene la descripción completa de BMI (clasificación + descripción detallada)"""
    return BMI_COMPLETE_DESCRIPTIONS.get(key, "")


def get_days_text(days):
    """Obtiene el texto de días transcurridos"""
    return DAYS_TEXT_MAP.get(days, DAYS_TEXT_TEMPLATE.format(days=days))


def get_text(key, **kwargs):
    """Obtiene un texto general formateado"""
    message = TEXTS.get(key, key)
    if kwargs:
        return message.format(**kwargs)
    return message


def get_frontend_messages():
    """Obtiene todos los mensajes para el frontend"""
    return FRONTEND_MESSAGES
