# Tests del Proyecto

Estructura organizada de tests para backend y frontend.

## Estructura General

```
tests/
├── backend/                 # Tests del backend (Python)
│   ├── blackbox/           # Tests de caja negra
│   ├── whitebox/           # Tests de caja blanca
│   └── conftest.py         # Fixtures compartidas
├── frontend/               # Tests del frontend (JavaScript)
│   ├── test_whitebox_helpers.test.js
│   ├── test_blackbox_storage.test.js
│   ├── test_whitebox_validation.test.js
│   ├── test_blackbox_sync.test.js
│   └── setup.js
└── README.md               # Este archivo
```

## Tests del Backend

Ver [tests/backend/README.md](backend/README.md) para más detalles.

**Total**: 86 tests

### Ejecutar
```bash
pytest tests/backend/ -v
```

## Tests del Frontend

Ver [tests/frontend/README.md](frontend/README.md) para más detalles.

**Total**: ~66 tests

### Ejecutar
```bash
npm test
```

## Ejecutar todos los tests

```bash
# Backend
pytest tests/backend/ -v

# Frontend
npm test

# Ambos (si tienes ambos instalados)
pytest tests/backend/ -v && npm test
```

## Ejecutar tests en Docker

### Backend (ya incluido en el contenedor principal)

```bash
docker-compose exec web pytest tests/backend/ -v
```

### Frontend (contenedor separado)

```bash
# Ejecutar tests del frontend en Docker
docker-compose run --rm frontend-tests

# O construir y ejecutar manualmente
docker build -f Dockerfile.test -t frontend-tests .
docker run --rm frontend-tests
```

## Notas

- Los tests del backend **no requieren** Node.js
- Los tests del frontend **requieren** Node.js y npm
- El Dockerfile principal solo incluye Python (para el backend)
- Para tests del frontend en Docker, usa `Dockerfile.test` o el servicio `frontend-tests` en docker-compose

