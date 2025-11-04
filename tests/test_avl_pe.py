import math


def test_get_user_not_found_returns_404(client):
    resp = client.get('/api/user')
    assert resp.status_code == 404
    assert resp.get_json().get('error')


def test_add_weight_without_user_returns_400(client):
    resp = client.post('/api/weight', json={"peso_kg": 80})
    assert resp.status_code == 400
    assert resp.get_json().get('error')


def test_create_user_and_get_returns_200_with_fields(client):
    payload = {
        "nombre": "Ana",
        "apellidos": "García",
        "fecha_nacimiento": "1990-01-15",
        "talla_m": 1.70,
    }
    save = client.post('/api/user', json=payload)
    assert save.status_code == 200

    got = client.get('/api/user')
    assert got.status_code == 200
    data = got.get_json()
    assert data["nombre"] == payload["nombre"]
    assert data["apellidos"] == payload["apellidos"]
    assert data["fecha_nacimiento"] == payload["fecha_nacimiento"]
    assert math.isclose(data["talla_m"], payload["talla_m"], rel_tol=1e-9)


def test_bmi_with_zero_or_negative_height_returns_zero_imc(client):
    # Create user with zero height
    save_user = client.post('/api/user', json={
        "nombre": "Luis",
        "apellidos": "Pérez",
        "fecha_nacimiento": "1985-05-05",
        "talla_m": 0.0,
    })
    assert save_user.status_code == 200

    # Add any weight
    add_w = client.post('/api/weight', json={"peso_kg": 80})
    assert add_w.status_code == 201

    # IMC should be 0 by helper rule when talla <= 0
    imc_resp = client.get('/api/imc')
    assert imc_resp.status_code == 200
    imc_data = imc_resp.get_json()
    assert imc_data["imc"] == 0
    # 0 -> "Bajo peso" per get_bmi_description
    assert imc_data["description"] == "Bajo peso"


def test_bmi_category_boundaries_with_last_weight(client):
    # Height 2.0m -> weight = BMI * 4
    payload = {
        "nombre": "Sara",
        "apellidos": "López",
        "fecha_nacimiento": "1992-10-10",
        "talla_m": 2.0,
    }
    assert client.post('/api/user', json=payload).status_code == 200

    # Boundary 18.5 -> Peso normal
    assert client.post('/api/weight', json={"peso_kg": 18.5 * 4}).status_code == 201
    imc1 = client.get('/api/imc').get_json()
    assert math.isclose(imc1["imc"], 18.5, rel_tol=1e-9)
    assert imc1["description"] == "Peso normal"

    # Boundary 25 -> Sobrepeso (since 25 <= imc < 30)
    assert client.post('/api/weight', json={"peso_kg": 25 * 4}).status_code == 201
    imc2 = client.get('/api/imc').get_json()
    assert math.isclose(imc2["imc"], 25.0, rel_tol=1e-9)
    assert imc2["description"] == "Sobrepeso"

    # Boundary 30 -> Obesidad (else branch)
    assert client.post('/api/weight', json={"peso_kg": 30 * 4}).status_code == 201
    imc3 = client.get('/api/imc').get_json()
    assert math.isclose(imc3["imc"], 30.0, rel_tol=1e-9)
    assert imc3["description"] == "Obesidad"


def test_stats_counts_max_min(client):
    # Create user and add three weights
    assert client.post('/api/user', json={
        "nombre": "Mario",
        "apellidos": "Ruiz",
        "fecha_nacimiento": "1980-03-03",
        "talla_m": 1.80,
    }).status_code == 200

    for w in [70.0, 80.0, 75.0]:
        assert client.post('/api/weight', json={"peso_kg": w}).status_code == 201

    stats = client.get('/api/stats')
    assert stats.status_code == 200
    data = stats.get_json()
    assert data["num_pesajes"] == 3
    assert data["peso_max"] == 80.0
    assert data["peso_min"] == 70.0
