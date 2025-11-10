/**
 * Tests de CAJA BLANCA para funciones de cálculo de IMC del frontend
 * Prueban la lógica interna de las funciones de cálculo de IMC
 * Equivalentes a tests/test_whitebox_helpers.py del backend
 * 
 * NOTA: Estos tests prueban la lógica matemática de las funciones helper,
 * no las validaciones de negocio. Las validaciones de límites (peso, altura)
 * se prueban en los tests de validación. Las funciones helper están diseñadas
 * para ser "puras" (solo cálculo), mientras que las validaciones defensivas
 * están en la capa superior (loadIMC() en main.js).
 */

// Importar funciones desde main.js
// Nota: En un entorno real, estas funciones deberían estar en un módulo separado
// Por ahora, las copiamos aquí para testing
function calculateBMI(weight_kg, height_m) {
    if (height_m <= 0) return 0;
    return Math.round((weight_kg / (height_m ** 2)) * 10) / 10; // Redondear a 1 decimal
}

function getBMIDescription(bmi) {
    // Determinar la clave según el rango de BMI
    let key;
    if (bmi < 18.5) {
        key = 'underweight';
    } else if (bmi < 25) {
        key = 'normal';
    } else if (bmi < 30) {
        key = 'overweight';
    } else if (bmi < 35) {
        key = 'obese_class_i';
    } else if (bmi < 40) {
        key = 'obese_class_ii';
    } else {
        key = 'obese_class_iii';
    }
    
    // Obtener la descripción del diccionario
    return MESSAGES.bmi_descriptions[key] || `IMC: ${bmi}`;
}

describe('TestCalculateBMI', () => {
    /**Tests de caja blanca para calculateBMI()*/
    
    test('test_calculate_bmi_normal - Test caso normal: peso y talla válidos', () => {
        expect(calculateBMI(70, 1.75)).toBe(22.9);
        expect(calculateBMI(60, 1.70)).toBe(20.8);
        expect(calculateBMI(80, 1.80)).toBe(24.7);
    });
    
    test('test_calculate_bmi_boundary_talla_cero - Test valor límite: talla = 0 (debe retornar 0)', () => {
        expect(calculateBMI(70, 0)).toBe(0);
    });
    
    test('test_calculate_bmi_boundary_talla_negativa - Test valor límite: talla negativa (debe retornar 0)', () => {
        expect(calculateBMI(70, -1)).toBe(0);
        expect(calculateBMI(70, -0.1)).toBe(0);
    });
    
    test('test_calculate_bmi_boundary_talla_pequeña - Test valor límite: talla muy pequeña pero positiva', () => {
        expect(calculateBMI(10, 0.5)).toBe(40.0);
        expect(calculateBMI(5, 0.1)).toBe(500.0);
    });
    
    test('test_calculate_bmi_boundary_talla_grande - Test valor límite: talla grande', () => {
        expect(calculateBMI(100, 2.5)).toBe(16.0);
    });
    
    test('test_calculate_bmi_precision - Test que el resultado se redondea a 1 decimal', () => {
        // 70 / (1.75^2) = 70 / 3.0625 = 22.857...
        expect(calculateBMI(70, 1.75)).toBe(22.9);
    });
    
    test('test_calculate_bmi_peso_cero - Test valor límite: peso = 0', () => {
        expect(calculateBMI(0, 1.75)).toBe(0.0);
    });
    
    test('test_calculate_bmi_peso_negativo - Test valor límite: peso negativo (caso edge)', () => {
        // Aunque no debería pasar en producción, probamos el comportamiento
        expect(calculateBMI(-10, 1.75)).toBe(-3.3);
    });
});

describe('TestGetBMIDescription', () => {
    /**Tests de caja blanca para getBMIDescription() con valores límite y particiones*/
    
    // ========== PARTICIONES DE EQUIVALENCIA ==========
    // Partición 1: IMC < 18.5 -> "Peso Bajo"
    // Partición 2: 18.5 <= IMC < 25 -> "Peso Normal"
    // Partición 3: 25 <= IMC < 30 -> "Sobrepeso"
    // Partición 4: 30 <= IMC < 35 -> "Obesidad Clase I"
    // Partición 5: 35 <= IMC < 40 -> "Obesidad Clase II"
    // Partición 6: IMC >= 40 -> "Obesidad Clase III"
    
    test('test_bajo_peso_particion_1 - Partición 1: IMC < 18.5', () => {
        expect(getBMIDescription(15.0)).toContain('Peso Bajo');
        expect(getBMIDescription(18.0)).toContain('Peso Bajo');
        expect(getBMIDescription(10.5)).toContain('Peso Bajo');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(15.0).length).toBeGreaterThan('Peso Bajo'.length);
    });
    
    test('test_bajo_peso_boundary_inferior - Valor límite inferior: IMC = 0', () => {
        expect(getBMIDescription(0)).toContain('Peso Bajo');
    });
    
    test('test_bajo_peso_boundary_superior - Valor límite superior: IMC = 18.4 (justo antes del límite)', () => {
        expect(getBMIDescription(18.4)).toContain('Peso Bajo');
    });
    
    test('test_peso_normal_particion_2 - Partición 2: 18.5 <= IMC < 25', () => {
        expect(getBMIDescription(18.5)).toContain('Peso Normal');
        expect(getBMIDescription(20.0)).toContain('Peso Normal');
        expect(getBMIDescription(24.9)).toContain('Peso Normal');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(20.0).length).toBeGreaterThan('Peso Normal'.length);
    });
    
    test('test_peso_normal_boundary_inferior - Valor límite inferior: IMC = 18.5 (límite exacto)', () => {
        expect(getBMIDescription(18.5)).toContain('Peso Normal');
    });
    
    test('test_peso_normal_boundary_superior - Valor límite superior: IMC = 24.9 (justo antes del límite)', () => {
        expect(getBMIDescription(24.9)).toContain('Peso Normal');
    });
    
    test('test_sobrepeso_particion_3 - Partición 3: 25 <= IMC < 30', () => {
        expect(getBMIDescription(25.0)).toContain('Sobrepeso');
        expect(getBMIDescription(27.5)).toContain('Sobrepeso');
        expect(getBMIDescription(29.9)).toContain('Sobrepeso');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(27.5).length).toBeGreaterThan('Sobrepeso'.length);
    });
    
    test('test_sobrepeso_boundary_inferior - Valor límite inferior: IMC = 25.0 (límite exacto)', () => {
        expect(getBMIDescription(25.0)).toContain('Sobrepeso');
    });
    
    test('test_sobrepeso_boundary_superior - Valor límite superior: IMC = 29.9 (justo antes del límite)', () => {
        expect(getBMIDescription(29.9)).toContain('Sobrepeso');
    });
    
    test('test_obesidad_clase_i_particion_4 - Partición 4: 30 <= IMC < 35', () => {
        expect(getBMIDescription(30.0)).toContain('Obesidad Clase I');
        expect(getBMIDescription(32.0)).toContain('Obesidad Clase I');
        expect(getBMIDescription(34.9)).toContain('Obesidad Clase I');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(32.0).length).toBeGreaterThan('Obesidad Clase I'.length);
    });
    
    test('test_obesidad_clase_i_boundary_inferior - Valor límite inferior: IMC = 30.0 (límite exacto)', () => {
        expect(getBMIDescription(30.0)).toContain('Obesidad Clase I');
    });
    
    test('test_obesidad_clase_i_boundary_superior - Valor límite superior: IMC = 34.9 (justo antes del límite)', () => {
        expect(getBMIDescription(34.9)).toContain('Obesidad Clase I');
    });
    
    test('test_obesidad_clase_ii_particion_5 - Partición 5: 35 <= IMC < 40', () => {
        expect(getBMIDescription(35.0)).toContain('Obesidad Clase II');
        expect(getBMIDescription(37.5)).toContain('Obesidad Clase II');
        expect(getBMIDescription(39.9)).toContain('Obesidad Clase II');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(37.5).length).toBeGreaterThan('Obesidad Clase II'.length);
    });
    
    test('test_obesidad_clase_ii_boundary_inferior - Valor límite inferior: IMC = 35.0 (límite exacto)', () => {
        expect(getBMIDescription(35.0)).toContain('Obesidad Clase II');
    });
    
    test('test_obesidad_clase_ii_boundary_superior - Valor límite superior: IMC = 39.9 (justo antes del límite)', () => {
        expect(getBMIDescription(39.9)).toContain('Obesidad Clase II');
    });
    
    test('test_obesidad_clase_iii_particion_6 - Partición 6: IMC >= 40', () => {
        expect(getBMIDescription(40.0)).toContain('Obesidad Clase III');
        expect(getBMIDescription(45.0)).toContain('Obesidad Clase III');
        expect(getBMIDescription(50.0)).toContain('Obesidad Clase III');
        // Verificar que la descripción no está vacía (se devuelve algo)
        expect(getBMIDescription(45.0).length).toBeGreaterThan('Obesidad Clase III'.length);
    });
    
    test('test_obesidad_clase_iii_boundary_inferior - Valor límite inferior: IMC = 40.0 (límite exacto)', () => {
        expect(getBMIDescription(40.0)).toContain('Obesidad Clase III');
    });
    
    test('test_obesidad_clase_iii_valores_extremos - Valores límite extremos: IMC muy alto', () => {
        expect(getBMIDescription(100.0)).toContain('Obesidad Clase III');
        expect(getBMIDescription(200.0)).toContain('Obesidad Clase III');
    });
    
    test('test_transiciones_limite - Tests de transición entre particiones (valores límite críticos)', () => {
        // Transición Bajo peso -> Peso normal
        expect(getBMIDescription(18.49)).toContain('Peso Bajo');
        expect(getBMIDescription(18.5)).toContain('Peso Normal');
        
        // Transición Peso normal -> Sobrepeso
        expect(getBMIDescription(24.99)).toContain('Peso Normal');
        expect(getBMIDescription(25.0)).toContain('Sobrepeso');
        
        // Transición Sobrepeso -> Obesidad Clase I
        expect(getBMIDescription(29.99)).toContain('Sobrepeso');
        expect(getBMIDescription(30.0)).toContain('Obesidad Clase I');
        
        // Transición Obesidad Clase I -> Obesidad Clase II
        expect(getBMIDescription(34.99)).toContain('Obesidad Clase I');
        expect(getBMIDescription(35.0)).toContain('Obesidad Clase II');
        
        // Transición Obesidad Clase II -> Obesidad Clase III
        expect(getBMIDescription(39.99)).toContain('Obesidad Clase II');
        expect(getBMIDescription(40.0)).toContain('Obesidad Clase III');
    });
});

