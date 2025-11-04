# Plan de Pruebas de Seguridad: PE (Pruebas de Penetración) y AVL (Análisis de Vulnerabilidades)

Este documento define el alcance, metodología, casos de prueba, comandos y criterios de aceptación para ejecutar PE y AVL sobre la aplicación Flask de Registro de IMC.

## 1. Alcance
- Aplicación web y API expuesta por Flask (Gunicorn):
  - `GET /`
  - `GET /api/user`
  - `POST /api/user`
  - `POST /api/weight`
  - `GET /api/imc`
  - `GET /api/stats`
- Imagen Docker, Dockerfile y docker-compose.
- Dependencias Python (`requirements.txt`).
- Base de datos SQLite almacenada en `instance/app.db`.

Fuera de alcance: autenticación de usuarios (monousuario), cifrado TLS (terminación en reverse proxy externo), multiusuario.

## 2. Metodología
- AVL (estático):
  - SCA: Auditoría de dependencias y licencias.
  - SAST: Análisis estático de código común para Python.
  - Análisis de imagen Docker y Dockerfile.
- PE/DAST (dinámico):
  - Exploración y fuzzing ligero sobre endpoints.
  - Pruebas de validación de entrada, inyección, XSS reflejado, DoS básico.
  - Revisión de cabeceras HTTP y configuraciones seguras.

Referencias: OWASP Top 10 2021, OWASP ASVS L1.

## 3. Preparación del entorno
- Ejecutar la aplicación localmente (Docker):
```bash
docker compose up --build -d
# Esperar a que web esté disponible en http://localhost:5000
```
- Variables: baseURL=`http://localhost:5000`

## 4. AVL — Análisis de Vulnerabilidades

### 4.1 Dependencias Python (SCA)
- pip-audit o safety:
```bash
pip install --upgrade pip pip-audit safety
pip-audit -r requirements.txt
safety check -r requirements.txt --full-report
```
Criterio de aceptación: 0 vulnerabilidades altas/críticas sin justificar. Documentar mitigaciones propuestas.

### 4.2 SAST Python (bandit)
```bash
pip install bandit
bandit -r app -ll
```
Criterio: 0 hallazgos de severidad alta. Evaluar y anotar falsos positivos.

### 4.3 Dockerfile e imagen
- Hadolint (Dockerfile):
```bash
hadolint Dockerfile
```
- Trivy (imagen):
```bash
docker build -t imc-app:local .
trivy image --severity HIGH,CRITICAL imc-app:local
```
- Dockle (prácticas de contenedor):
```bash
dockle imc-app:local
```
Criterio: 0 críticas; altas mitigadas/documentadas.

## 5. PE/DAST — Pruebas Dinámicas

### 5.1 Descubrimiento y baseline
- ZAP baseline (sin autenticación):
```bash
zap-baseline.py -t http://localhost:5000 -r zap_report.html -m 5
```
Criterio: sin alertas medias/altas no justificadas.

### 5.2 Validación de entrada y errores
- `POST /api/user` — campos requeridos y tipos:
```bash
curl -s -X POST http://localhost:5000/api/user \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"A","apellidos":"B","fecha_nacimiento":"1990-01-01","talla_m":"1.80"}' | jq .
```
Casos:
- Altura negativa: `talla_m:-1.75` → Debe rechazar 400.
- Fecha inválida: `fecha_nacimiento:"1990-13-40"` → 400.
- Faltan campos: enviar JSON vacío → 400.

Nota: actualmente el backend asume datos válidos y puede responder 500. Registrar hallazgos si corresponde.

- `POST /api/weight` — tipos y rangos:
```bash
# Sin usuario creado → 400 esperado
curl -s -X POST http://localhost:5000/api/weight -H 'Content-Type: application/json' -d '{"peso_kg":70}' | jq .
```
Casos:
- Peso no numérico: `peso_kg:"abc"` → 400 esperado.
- Peso negativo o 0 → 400 esperado.
- Peso extremo (>500) → 400 esperado.

### 5.3 Inyección (SQLi) y XSS
- SQLi básicos:
```bash
curl -s -X POST http://localhost:5000/api/user -H 'Content-Type: application/json' \
  -d '{"nombre":"\" OR 1=1 --","apellidos":"x","fecha_nacimiento":"1990-01-01","talla_m":"1.75"}' | jq .
```
Resultado esperado: el backend trata los valores como datos; sin errores 500 ni ejecución de inyección.

- XSS reflejado en vistas/JSON:
```bash
curl -s http://localhost:5000/ | grep -i '<script>' || true
```
- Asegurar que campos controlados por usuario no se inyecten directamente en HTML sin escape. Revisar que el saludo se obtiene por JS desde API y no imprime HTML arbitrario.

### 5.4 Robustez y DoS básicos
- Payloads grandes:
```bash
python - <<'PY'
import requests, json
u='http://localhost:5000/api/user'
p={'nombre':'A'*1000000,'apellidos':'B','fecha_nacimiento':'1990-01-01','talla_m':'1.80'}
print(requests.post(u, json=p, timeout=10).status_code)
PY
```
Criterio: la app no debe colapsar; idealmente 413/400.

### 5.5 Cabeceras y configuración segura
```bash
curl -s -D - http://localhost:5000/ -o /dev/null | grep -E 'Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Referrer-Policy|Permissions-Policy'
```
Criterio: Presencia de al menos `X-Content-Type-Options: nosniff`. Recomendado añadir CSP, XFO, Referrer-Policy y Permissions-Policy vía reverse proxy o Flask middleware.

## 6. Casos de prueba específicos por endpoint

- `GET /api/user` sin usuario: 404 con `{error}`.
- `POST /api/user` correcto: 200 `{message}` y persistencia en SQLite.
- `POST /api/weight` sin usuario: 400 `{error}`.
- `POST /api/weight` correcto: 201 `{message}` y registro con `fecha_registro` automático.
- `GET /api/imc` sin usuario: 404 `{error}`.
- `GET /api/imc` sin pesajes: 200 `{imc:0, description:"Sin registros de peso"}`.
- `GET /api/stats` sin pesajes: 200 con `0` en métricas.

Para cada caso, registrar: request, response, status, evidencia (captura/comando), resultado esperado/obtenido.

## 7. Hallazgos esperados y recomendaciones
- Validación de entrada en backend: añadir validaciones y respuestas 400 para tipos/rangos (altura>0, peso>0 y <500, fechas válidas).
- Manejo de errores controlado: evitar tracebacks en respuestas (usar `errorhandlers`).
- Cabeceras seguras: agregar `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y CSP en reverse proxy o `Flask-Talisman` (opcional).
- Límite de tamaño de payload (`MAX_CONTENT_LENGTH`) en Flask.
- Rate limiting (opcional) con `Flask-Limiter` para `POST`.
- Docker: usuarios no root y capas mínimas (evaluar según hadolint/dockle).

## 8. Evidencias y reporte
- Incluir:
  - `zap_report.html`, salidas de `pip-audit`, `bandit`, `trivy`, `hadolint`, `dockle`.
  - Capturas o logs de `curl`/scripts.
- Clasificar: Crítica/Alta/Media/Baja, con recomendación, responsable y ETA.

## 9. Checklist de verificación rápida
- [ ] `pip-audit` sin altas/críticas o con mitigación.
- [ ] `bandit -ll` sin críticas.
- [ ] `trivy` sin HIGH/CRITICAL en imagen.
- [ ] `hadolint` sin errores críticos del Dockerfile.
- [ ] `zap-baseline` sin alertas medias/altas.
- [ ] Validaciones de entrada devuelven 400 coherente.
- [ ] Sin XSS reflejado.
- [ ] Cabeceras mínimas presentes o plan para reverse proxy.
- [ ] Pruebas de carga/payload grande no derriban la app.

---

Notas:
- Este plan es incremental y adaptable. Si se despliega tras un reverse proxy (Nginx/Traefik) con TLS, repetir DAST sobre el endpoint público y validar cabeceras/caché/cookies.
