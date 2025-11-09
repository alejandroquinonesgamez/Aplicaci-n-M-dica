/**
 * Archivo de mensajes para la interfaz de usuario
 * Expone MESSAGES que apunta al sistema de traducciones
 */

// Objeto global de mensajes (se actualiza cuando las traducciones están listas)
let MESSAGES = {};

/**
 * Sincroniza la referencia de MESSAGES con el sistema de traducciones
 */
function updateMessagesReference() {
    if (window.TranslationManager) {
        // Crear un getter que siempre devuelva los mensajes actuales
        Object.defineProperty(window, 'MESSAGES', {
            get: function() {
                return window.TranslationManager.getMessages();
            },
            configurable: true
        });
        MESSAGES = window.TranslationManager.getMessages();
    } else {
        // Si TranslationManager no está disponible, esperar un poco y reintentar
        setTimeout(updateMessagesReference, 100);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMessagesReference);
} else {
    updateMessagesReference();
}

