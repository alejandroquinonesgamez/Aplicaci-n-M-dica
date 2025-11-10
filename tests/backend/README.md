# Tests del Backend

Tests de caja blanca y caja negra para el backend de la aplicación médica.

## Estructura

```
tests/backend/
├── conftest.py              # Fixtures y helpers compartidos
├── blackbox/                # Tests de caja negra
│   ├── test_api.py          # Tests de endpoints específicos
│   └── test_flows.py        # Tests de flujos completos
└── whitebox/                # Tests de caja blanca
    ├── test_helpers.py      # Tests de funciones de cálculo
    ├── test_validation.py   # Tests de validaciones y límites
    └── test_storage.py      # Tests del sistema de almacenamiento
```

## Ejecutar tests

```bash
# Todos los tests del backend
pytest tests/backend/ -v

# Solo tests de caja negra
pytest tests/backend/blackbox/ -v

# Solo tests de caja blanca
pytest tests/backend/whitebox/ -v

# Tests específicos
pytest tests/backend/blackbox/test_api.py -v
```

## Descripción de archivos

### `conftest.py`
- Fixtures compartidas: `app`, `client`, `sample_user`, `sample_weights`
- Helpers de aserción: `assert_success`, `assert_created`, `assert_bad_request`, `assert_not_found`

### `blackbox/test_api.py`
- Tests de endpoints específicos de la API
- Tests de manejo de errores
- Tests de formato de respuestas
- Tests de validaciones defensivas (peso/altura fuera de rango en `/api/imc`)
- **20 tests** (incluye 2 nuevos tests de validaciones defensivas)

### `blackbox/test_flows.py`
- Tests de flujos completos de usuario
- Tests de integración entre endpoints
- **13 tests**

### `whitebox/test_helpers.py`
- Tests de funciones de cálculo de IMC
- Tests de clasificación de BMI
- Valores límite y particiones de equivalencia
- **Nota**: Estos tests prueban la lógica matemática de las funciones helper, no las validaciones de negocio. Las validaciones defensivas están en la capa superior (rutas).
- **22 tests**

### `whitebox/test_validation.py`
- Tests de límites de validación (altura, peso, fecha)
- Tests de particiones de equivalencia
- **20 tests**

### `whitebox/test_storage.py`
- Tests del sistema de almacenamiento
- Tests de métodos del storage
- **5 tests**

## Validaciones Defensivas

La aplicación implementa **validaciones defensivas** en múltiples capas:

1. **Validación en entrada de datos**: Los endpoints `/api/user` y `/api/weight` validan los límites antes de guardar
2. **Validación defensiva antes de calcular IMC**: El endpoint `/api/imc` valida que los datos almacenados estén dentro de los límites antes de llamar a las funciones helper
   - Protege contra datos antiguos o corruptos
   - Detecta datos inválidos si cambian los límites de validación
   - Tests: `test_get_imc_with_invalid_weight`, `test_get_imc_with_invalid_height`

Las funciones helper (`calculate_bmi`, `get_bmi_description`) se mantienen "puras" (solo cálculo matemático), mientras que las validaciones de negocio están en la capa superior (rutas).

## Total de tests

**86 tests** del backend ✅

