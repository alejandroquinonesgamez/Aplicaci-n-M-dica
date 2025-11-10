# Tests del Frontend

Tests de caja blanca y caja negra para el frontend de la aplicación médica.

## Requisitos

Para ejecutar los tests del frontend necesitas:
- **Node.js** (versión 14 o superior)
- **npm** (viene con Node.js)

## Instalación

```bash
# Instalar dependencias de Node.js (Jest y jest-environment-jsdom)
npm install
```

## Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar con cobertura de código
npm run test:coverage
```

## Estructura

- `test_whitebox_helpers.test.js` - Tests de caja blanca para funciones de cálculo de IMC
- `test_blackbox_storage.test.js` - Tests de caja negra para LocalStorageManager
- `test_whitebox_validation.test.js` - Tests de límites y particiones de equivalencia para validaciones
- `test_blackbox_sync.test.js` - Tests de caja negra para SyncManager
- `setup.js` - Configuración global para los tests (mocks de localStorage, fetch, etc.)

## Equivalencia con tests del backend

Estos tests son equivalentes a los tests del backend:

| Frontend | Backend |
|----------|---------|
| `test_whitebox_helpers.test.js` | `test_whitebox_helpers.py` |
| `test_blackbox_storage.test.js` | `test_blackbox.py` |
| `test_whitebox_validation.test.js` | `test_whitebox.py` |
| `test_blackbox_sync.test.js` | (Nuevo - específico de sincronización) |

## Cobertura

Los tests cubren:
- ✅ Funciones de cálculo de IMC (calculateBMI, getBMIDescription)
- ✅ LocalStorageManager (getUser, saveUser, addWeight, getStats, etc.)
- ✅ Validaciones (altura, peso, fecha de nacimiento)
- ✅ SyncManager (sincronización con backend)
- ✅ Valores límite y particiones de equivalencia

## Validaciones Defensivas

La aplicación implementa **validaciones defensivas** en múltiples capas:

1. **Validación en formularios**: Los formularios validan los límites antes de enviar datos
2. **Validación defensiva antes de calcular IMC**: La función `loadIMC()` valida que los datos locales estén dentro de los límites antes de calcular
   - Protege contra datos antiguos o corruptos en localStorage
   - Detecta datos inválidos si cambian los límites de validación
   - Muestra mensajes de error en la UI si los datos están fuera de rango

Las funciones helper (`calculateBMI`, `getBMIDescription`) se mantienen "puras" (solo cálculo matemático), mientras que las validaciones de negocio están en la capa superior (`loadIMC()` en `main.js`).

## Nota

Los tests del frontend se ejecutan **localmente** con Node.js. No están incluidos en el Dockerfile actual, que solo tiene Python para el backend.

Si quieres ejecutar los tests en Docker, necesitarías:
1. Añadir Node.js al Dockerfile, o
2. Crear un contenedor separado para tests del frontend
