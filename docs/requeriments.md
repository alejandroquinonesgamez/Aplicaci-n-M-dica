# 📋 Documento de Requerimientos Funcionales - Aplicación Web de Registro de Peso e IMC

## 1. Alcance y Usuarios

La aplicación es una herramienta **monousuario** diseñada exclusivamente para el registro personal de la talla, el peso y el cálculo del IMC del cliente. **No se requiere** autenticación compleja (usuario/contraseña) ni capacidades multiusuario.

## 2. Requerimientos de Datos del Cliente (Persistencia)

La aplicación debe solicitar y **almacenar de forma persistente** (localmente en el navegador) los siguientes datos personales del cliente:

* **Nombre**
* **Apellidos**
* **Fecha de Nacimiento**
* **Talla (en metros)**

## 3. Requerimientos de Funcionalidad de Registro

### 3.1. Registro de Peso
La aplicación debe permitir al cliente registrar su peso actual.

* **Dato a registrar:** Peso (en kilogramos).
* **Almacenamiento:** Cada registro de peso debe guardarse junto con la **fecha y hora** del momento del registro.

## 4. Requerimientos de Interfaz y Experiencia de Usuario (UX)

### 4.1. Bienvenida Personalizada
Al iniciar la aplicación, debe mostrar un **saludo personalizado** utilizando el nombre del cliente almacenado.

### 4.2. Visualización del IMC
La aplicación debe mostrar el **Índice de Masa Corporal (IMC)** del cliente basándose en el último peso registrado y la talla almacenada.

* **Fórmula:** $\text{IMC} = \frac{\text{Peso (kg)}}{\text{Talla (m)}^2}$
* **Descripción Requerida:** Se debe incluir una **breve descripción** que explique el significado del valor actual del IMC (ej. "Bajo peso," "Peso normal," etc.).

## 5. Requerimientos de Estadísticas (Reportes)

La aplicación debe calcular y mostrar de forma visible las siguientes estadísticas históricas basadas en todos los registros de peso guardados:

| ID | Estadística Requerida | Detalle |
| :--- | :--- | :--- |
| **5.1** | **Número de Pesajes** | El total de entradas de peso realizadas por el cliente. |
| **5.2** | **Peso Máximo Registrado** | El valor más alto de peso (en kilos) registrado en la historia. |
| **5.3** | **Peso Mínimo Registrado** | El valor más bajo de peso (en kilos) registrado en la historia. |

---

## 6. Restricciones y Exclusiones

* **Restricción de Multi-usuario:** La aplicación es estrictamente monousuario.
* **Exclusión de Funcionalidad Adicional:** No se deben añadir funcionalidades no especificadas (ej. gestión de metas, gráficos, exportación de datos, edición de registros, sistema de autenticación complejo, etc.).
* **Unidades:** Los datos se manejarán estrictamente en **metros (talla)** y **kilogramos (peso)**.