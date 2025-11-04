# 📝 Manual de Usuario - Registro Personal de Peso e IMC

## 🚀 Inicio de Sesión y Bienvenida

Esta aplicación es estrictamente **monousuario** y no requiere un sistema de inicio de sesión tradicional (usuario/contraseña). La primera vez que accedas, te pediremos tus datos básicos.

### 1. **Registro Inicial de Datos**

Al abrir la aplicación por primera vez, se te solicitará introducir la siguiente información. Esta información se guardará en tu navegador para futuras sesiones:

* **Nombre**
* **Apellidos**
* **Fecha de Nacimiento**
* **Talla (en metros)**: Introduce tu altura en metros (ejemplo: `1.75`).

### 2. **Bienvenida Personalizada**

Una vez guardados tus datos, cada vez que inicies la aplicación, serás recibido con un **saludo personalizado** usando tu nombre, creando una experiencia más cercana.

---

## 📊 Registro de Peso y Visualización del IMC

Esta es la funcionalidad central de la aplicación. Te permite registrar nuevos datos y te da una retroalimentación inmediata sobre tu IMC.

### 1. **Registrar un Nuevo Peso**

En la sección principal de la aplicación, encontrarás el formulario de registro:

* **Peso (en kilos)**: Introduce tu peso actual en kilogramos (ejemplo: `78.5`).
* Pulsa el botón **"Registrar Peso"** para guardar la entrada con la fecha y hora actuales.

### 2. **Cálculo y Descripción del IMC**

Inmediatamente después de registrar un nuevo peso, la aplicación mostrará tu **IMC actual** y una breve descripción.

* **Fórmula utilizada**: El Índice de Masa Corporal (IMC) se calcula dividiendo tu peso (en kilogramos) por el cuadrado de tu altura (en metros).
    $$\text{IMC} = \frac{\text{Peso (kg)}}{\text{Talla (m)}^2}$$
* **Descripción**: Se incluirá un texto conciso que explica lo que significa tu valor de IMC actual (ej. "Bajo peso," "Peso normal," "Sobrepeso," etc.).

---

## 📈 Estadísticas Históricas de Peso

La aplicación lleva un control automático de todos tus registros para ofrecerte datos resumidos de tu progreso.

### 1. **Contador de Pesajes**

La aplicación mostrará claramente el **Número de Pesajes Realizados** hasta la fecha, indicando la cantidad total de registros que has guardado en la aplicación.

### 2. **Peso Máximo Registrado**

Se indicará el **Peso Máximo** que has introducido desde que comenzaste a usar la aplicación.

### 3. **Peso Mínimo Registrado**

Se indicará el **Peso Mínimo** que has introducido desde que comenzaste a usar la aplicación.

---

## 🔒 Consideraciones Técnicas

* **Almacenamiento de Datos**: Dado que la aplicación es solo para ti, todos tus datos (nombre, peso, etc.) se almacenan localmente en tu **navegador web** (usando tecnologías como `localStorage`).
* **Importante**: Si borras la caché o los datos de navegación de tu navegador, **perderás todos los datos** de esta aplicación. Es crucial evitar borrar los "Datos de sitios web" si quieres conservar tu historial.
