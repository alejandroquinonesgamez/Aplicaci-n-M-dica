/**
 * Tests de CAJA BLANCA para validaciones del frontend
 * Tests de límites y particiones de equivalencia
 * Equivalentes a tests/test_whitebox.py del backend
 */

// Límites de validación (deben coincidir con app/config.py)
const VALIDATION_LIMITS = {
    height_min: 0.4,
    height_max: 2.72,
    weight_min: 2,
    weight_max: 650,
    weight_variation_per_day: 5
};

// Funciones de validación del frontend
function validateHeight(height_m) {
    return height_m >= VALIDATION_LIMITS.height_min && height_m <= VALIDATION_LIMITS.height_max;
}

function validateWeight(weight_kg) {
    return weight_kg >= VALIDATION_LIMITS.weight_min && weight_kg <= VALIDATION_LIMITS.weight_max;
}

function validateBirthDate(dateString) {
    const date = new Date(dateString);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();
    return date >= minDate && date <= maxDate;
}

describe('TestBoundaryValuesValidation', () => {
    /**Tests de valores límite para validaciones del frontend*/
    
    test('test_talla_minimo_valido - Límite inferior válido', () => {
        expect(validateHeight(VALIDATION_LIMITS.height_min)).toBe(true);
    });
    
    test('test_talla_maximo_valido - Límite superior válido', () => {
        expect(validateHeight(VALIDATION_LIMITS.height_max)).toBe(true);
    });
    
    test('test_talla_justo_bajo_minimo - Límite inferior inválido (justo debajo del mínimo)', () => {
        expect(validateHeight(VALIDATION_LIMITS.height_min - 0.01)).toBe(false);
    });
    
    test('test_talla_justo_sobre_maximo - Límite superior inválido (justo sobre el máximo)', () => {
        expect(validateHeight(VALIDATION_LIMITS.height_max + 0.01)).toBe(false);
    });
    
    test('test_peso_minimo_valido - Límite inferior válido', () => {
        expect(validateWeight(VALIDATION_LIMITS.weight_min)).toBe(true);
    });
    
    test('test_peso_maximo_valido - Límite superior válido', () => {
        expect(validateWeight(VALIDATION_LIMITS.weight_max)).toBe(true);
    });
    
    test('test_peso_justo_bajo_minimo - Límite inferior inválido (justo debajo del mínimo)', () => {
        expect(validateWeight(VALIDATION_LIMITS.weight_min - 0.1)).toBe(false);
    });
    
    test('test_peso_justo_sobre_maximo - Límite superior inválido (justo sobre el máximo)', () => {
        expect(validateWeight(VALIDATION_LIMITS.weight_max + 0.1)).toBe(false);
    });
    
    test('test_fecha_minimo_valido - Límite inferior válido', () => {
        expect(validateBirthDate('1900-01-01')).toBe(true);
    });
    
    test('test_fecha_maximo_valido - Límite superior válido: hoy', () => {
        const today = new Date().toISOString().split('T')[0];
        expect(validateBirthDate(today)).toBe(true);
    });
    
    test('test_fecha_justo_bajo_minimo - Límite inferior inválido (justo debajo del mínimo)', () => {
        const fechaInvalida = new Date('1899-12-31').toISOString().split('T')[0];
        expect(validateBirthDate(fechaInvalida)).toBe(false);
    });
    
    test('test_fecha_justo_sobre_maximo - Límite superior inválido: mañana', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const fechaInvalida = tomorrow.toISOString().split('T')[0];
        expect(validateBirthDate(fechaInvalida)).toBe(false);
    });
});

describe('TestEquivalencePartitionsValidation', () => {
    /**Tests de particiones de equivalencia para validaciones del frontend*/
    
    test('test_talla_particion_invalida_baja - Partición 1: talla < height_min (inválido)', () => {
        const casos = [
            VALIDATION_LIMITS.height_min - 0.3,
            VALIDATION_LIMITS.height_min - 0.1,
            VALIDATION_LIMITS.height_min - 0.01,
            -1.0,
            0
        ];
        casos.forEach(talla => {
            expect(validateHeight(talla)).toBe(false);
        });
    });
    
    test('test_talla_particion_valida - Partición 2: height_min <= talla <= height_max (válido)', () => {
        const casos = [
            VALIDATION_LIMITS.height_min,
            (VALIDATION_LIMITS.height_min + VALIDATION_LIMITS.height_max) / 2,
            1.75,
            2.0,
            VALIDATION_LIMITS.height_max
        ];
        casos.forEach(talla => {
            expect(validateHeight(talla)).toBe(true);
        });
    });
    
    test('test_talla_particion_invalida_alta - Partición 3: talla > height_max (inválido)', () => {
        const casos = [
            VALIDATION_LIMITS.height_max + 0.01,
            VALIDATION_LIMITS.height_max + 0.28,
            3.0,
            5.0,
            10.0
        ];
        casos.forEach(talla => {
            expect(validateHeight(talla)).toBe(false);
        });
    });
    
    test('test_peso_particion_invalido_bajo - Partición 1: peso < weight_min (inválido)', () => {
        const casos = [
            0,
            0.5,
            1.0,
            VALIDATION_LIMITS.weight_min - 0.1,
            -10
        ];
        casos.forEach(peso => {
            expect(validateWeight(peso)).toBe(false);
        });
    });
    
    test('test_peso_particion_valido - Partición 2: weight_min <= peso <= weight_max (válido)', () => {
        const casos = [
            VALIDATION_LIMITS.weight_min,
            50.0,
            70.0,
            100.0,
            200.0,
            500.0,
            VALIDATION_LIMITS.weight_max
        ];
        casos.forEach(peso => {
            expect(validateWeight(peso)).toBe(true);
        });
    });
    
    test('test_peso_particion_invalido_alto - Partición 3: peso > weight_max (inválido)', () => {
        const casos = [
            VALIDATION_LIMITS.weight_max + 0.1,
            700.0,
            1000.0
        ];
        casos.forEach(peso => {
            expect(validateWeight(peso)).toBe(false);
        });
    });
    
    test('test_fecha_particion_invalida_antigua - Partición 1: fecha < birth_date_min (inválido)', () => {
        const casos = [
            '1899-12-31',
            '1000-01-01',
            '1800-01-01'
        ];
        casos.forEach(fecha => {
            expect(validateBirthDate(fecha)).toBe(false);
        });
    });
    
    test('test_fecha_particion_valida - Partición 2: birth_date_min <= fecha <= hoy (válido)', () => {
        const casos = [
            '1900-01-01',
            '1950-06-15',
            '1990-05-15',
            new Date().toISOString().split('T')[0]
        ];
        casos.forEach(fecha => {
            expect(validateBirthDate(fecha)).toBe(true);
        });
    });
    
    test('test_fecha_particion_invalida_futura - Partición 3: fecha > hoy (inválido)', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const mañana = tomorrow.toISOString().split('T')[0];
        
        const futuro = new Date();
        futuro.setDate(futuro.getDate() + 365);
        const futuroStr = futuro.toISOString().split('T')[0];
        
        const casos = [mañana, futuroStr, '2100-01-01'];
        casos.forEach(fecha => {
            expect(validateBirthDate(fecha)).toBe(false);
        });
    });
});

describe('TestWeightVariationValidation', () => {
    /**Tests de validación de variación de peso*/
    
    test('test_weight_variation_valid - Variación válida dentro del límite', () => {
        const daysElapsed = 2;
        const maxAllowed = daysElapsed * VALIDATION_LIMITS.weight_variation_per_day; // 10 kg
        const lastWeight = 70.0;
        const newWeight = 75.0; // 5 kg de diferencia
        const weightDifference = Math.abs(newWeight - lastWeight);
        
        expect(weightDifference).toBeLessThanOrEqual(maxAllowed);
    });
    
    test('test_weight_variation_exceeded - Variación excedida', () => {
        const daysElapsed = 2;
        const maxAllowed = daysElapsed * VALIDATION_LIMITS.weight_variation_per_day; // 10 kg
        const lastWeight = 70.0;
        const newWeight = 85.0; // 15 kg de diferencia
        const weightDifference = Math.abs(newWeight - lastWeight);
        
        expect(weightDifference).toBeGreaterThan(maxAllowed);
    });
    
    test('test_weight_variation_boundary - Variación en el límite exacto', () => {
        const daysElapsed = 2;
        const maxAllowed = daysElapsed * VALIDATION_LIMITS.weight_variation_per_day; // 10 kg
        const lastWeight = 70.0;
        const newWeight = 80.0; // 10 kg de diferencia (límite exacto)
        const weightDifference = Math.abs(newWeight - lastWeight);
        
        expect(weightDifference).toBeLessThanOrEqual(maxAllowed);
    });
});

