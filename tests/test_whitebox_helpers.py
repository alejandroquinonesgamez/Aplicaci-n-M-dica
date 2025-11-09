"""
Tests de CAJA BLANCA para helpers.py
Prueban la lógica interna de las funciones de cálculo de IMC
"""
import pytest
from app.helpers import calculate_bmi, get_bmi_description


class TestCalculateBMI:
    """Tests de caja blanca para calculate_bmi()"""
    
    def test_calculate_bmi_normal(self):
        """Test caso normal: peso y talla válidos"""
        assert calculate_bmi(70, 1.75) == 22.9
        assert calculate_bmi(60, 1.70) == 20.8
        assert calculate_bmi(80, 1.80) == 24.7
    
    def test_calculate_bmi_boundary_talla_cero(self):
        """Test valor límite: talla = 0 (debe retornar 0)"""
        assert calculate_bmi(70, 0) == 0
    
    def test_calculate_bmi_boundary_talla_negativa(self):
        """Test valor límite: talla negativa (debe retornar 0)"""
        assert calculate_bmi(70, -1) == 0
        assert calculate_bmi(70, -0.1) == 0
    
    def test_calculate_bmi_boundary_talla_pequeña(self):
        """Test valor límite: talla muy pequeña pero positiva"""
        assert calculate_bmi(10, 0.5) == 40.0
        assert calculate_bmi(5, 0.1) == 500.0
    
    def test_calculate_bmi_boundary_talla_grande(self):
        """Test valor límite: talla grande"""
        assert calculate_bmi(100, 2.5) == 16.0
    
    def test_calculate_bmi_precision(self):
        """Test que el resultado se redondea a 1 decimal"""
        # 70 / (1.75^2) = 70 / 3.0625 = 22.857...
        assert calculate_bmi(70, 1.75) == 22.9
    
    def test_calculate_bmi_peso_cero(self):
        """Test valor límite: peso = 0"""
        assert calculate_bmi(0, 1.75) == 0.0
    
    def test_calculate_bmi_peso_negativo(self):
        """Test valor límite: peso negativo (caso edge)"""
        # Aunque no debería pasar en producción, probamos el comportamiento
        assert calculate_bmi(-10, 1.75) == -3.3


class TestGetBMIDescription:
    """Tests de caja blanca para get_bmi_description() con valores límite y particiones"""
    
    # ========== PARTICIONES DE EQUIVALENCIA ==========
    # Partición 1: IMC < 18.5 -> "Peso Bajo"
    # Partición 2: 18.5 <= IMC < 25 -> "Peso Normal"
    # Partición 3: 25 <= IMC < 30 -> "Sobrepeso"
    # Partición 4: 30 <= IMC < 35 -> "Obesidad Clase I"
    # Partición 5: 35 <= IMC < 40 -> "Obesidad Clase II"
    # Partición 6: IMC >= 40 -> "Obesidad Clase III"
    
    def test_bajo_peso_particion_1(self):
        """Partición 1: IMC < 18.5"""
        assert "Peso Bajo" in get_bmi_description(15.0)
        assert "Peso Bajo" in get_bmi_description(18.0)
        assert "Peso Bajo" in get_bmi_description(10.5)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(15.0)) > len("Peso Bajo")
    
    def test_bajo_peso_boundary_inferior(self):
        """Valor límite inferior: IMC = 0"""
        assert "Peso Bajo" in get_bmi_description(0)
    
    def test_bajo_peso_boundary_superior(self):
        """Valor límite superior: IMC = 18.4 (justo antes del límite)"""
        assert "Peso Bajo" in get_bmi_description(18.4)
    
    def test_peso_normal_particion_2(self):
        """Partición 2: 18.5 <= IMC < 25"""
        assert "Peso Normal" in get_bmi_description(18.5)
        assert "Peso Normal" in get_bmi_description(20.0)
        assert "Peso Normal" in get_bmi_description(24.9)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(20.0)) > len("Peso Normal")
    
    def test_peso_normal_boundary_inferior(self):
        """Valor límite inferior: IMC = 18.5 (límite exacto)"""
        assert "Peso Normal" in get_bmi_description(18.5)
    
    def test_peso_normal_boundary_superior(self):
        """Valor límite superior: IMC = 24.9 (justo antes del límite)"""
        assert "Peso Normal" in get_bmi_description(24.9)
    
    def test_sobrepeso_particion_3(self):
        """Partición 3: 25 <= IMC < 30"""
        assert "Sobrepeso" in get_bmi_description(25.0)
        assert "Sobrepeso" in get_bmi_description(27.5)
        assert "Sobrepeso" in get_bmi_description(29.9)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(27.5)) > len("Sobrepeso")
    
    def test_sobrepeso_boundary_inferior(self):
        """Valor límite inferior: IMC = 25.0 (límite exacto)"""
        assert "Sobrepeso" in get_bmi_description(25.0)
    
    def test_sobrepeso_boundary_superior(self):
        """Valor límite superior: IMC = 29.9 (justo antes del límite)"""
        assert "Sobrepeso" in get_bmi_description(29.9)
    
    def test_obesidad_clase_i_particion_4(self):
        """Partición 4: 30 <= IMC < 35"""
        assert "Obesidad Clase I" in get_bmi_description(30.0)
        assert "Obesidad Clase I" in get_bmi_description(32.0)
        assert "Obesidad Clase I" in get_bmi_description(34.9)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(32.0)) > len("Obesidad Clase I")
    
    def test_obesidad_clase_i_boundary_inferior(self):
        """Valor límite inferior: IMC = 30.0 (límite exacto)"""
        assert "Obesidad Clase I" in get_bmi_description(30.0)
    
    def test_obesidad_clase_i_boundary_superior(self):
        """Valor límite superior: IMC = 34.9 (justo antes del límite)"""
        assert "Obesidad Clase I" in get_bmi_description(34.9)
    
    def test_obesidad_clase_ii_particion_5(self):
        """Partición 5: 35 <= IMC < 40"""
        assert "Obesidad Clase II" in get_bmi_description(35.0)
        assert "Obesidad Clase II" in get_bmi_description(37.5)
        assert "Obesidad Clase II" in get_bmi_description(39.9)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(37.5)) > len("Obesidad Clase II")
    
    def test_obesidad_clase_ii_boundary_inferior(self):
        """Valor límite inferior: IMC = 35.0 (límite exacto)"""
        assert "Obesidad Clase II" in get_bmi_description(35.0)
    
    def test_obesidad_clase_ii_boundary_superior(self):
        """Valor límite superior: IMC = 39.9 (justo antes del límite)"""
        assert "Obesidad Clase II" in get_bmi_description(39.9)
    
    def test_obesidad_clase_iii_particion_6(self):
        """Partición 6: IMC >= 40"""
        assert "Obesidad Clase III" in get_bmi_description(40.0)
        assert "Obesidad Clase III" in get_bmi_description(45.0)
        assert "Obesidad Clase III" in get_bmi_description(50.0)
        # Verificar que la descripción no está vacía (se devuelve algo)
        assert len(get_bmi_description(45.0)) > len("Obesidad Clase III")
    
    def test_obesidad_clase_iii_boundary_inferior(self):
        """Valor límite inferior: IMC = 40.0 (límite exacto)"""
        assert "Obesidad Clase III" in get_bmi_description(40.0)
    
    def test_obesidad_clase_iii_valores_extremos(self):
        """Valores límite extremos: IMC muy alto"""
        assert "Obesidad Clase III" in get_bmi_description(100.0)
        assert "Obesidad Clase III" in get_bmi_description(200.0)
    
    def test_transiciones_limite(self):
        """Tests de transición entre particiones (valores límite críticos)"""
        # Transición Bajo peso -> Peso normal
        assert "Peso Bajo" in get_bmi_description(18.49)
        assert "Peso Normal" in get_bmi_description(18.5)
        
        # Transición Peso normal -> Sobrepeso
        assert "Peso Normal" in get_bmi_description(24.99)
        assert "Sobrepeso" in get_bmi_description(25.0)
        
        # Transición Sobrepeso -> Obesidad Clase I
        assert "Sobrepeso" in get_bmi_description(29.99)
        assert "Obesidad Clase I" in get_bmi_description(30.0)
        
        # Transición Obesidad Clase I -> Obesidad Clase II
        assert "Obesidad Clase I" in get_bmi_description(34.99)
        assert "Obesidad Clase II" in get_bmi_description(35.0)
        
        # Transición Obesidad Clase II -> Obesidad Clase III
        assert "Obesidad Clase II" in get_bmi_description(39.99)
        assert "Obesidad Clase III" in get_bmi_description(40.0)

