document.addEventListener('DOMContentLoaded', () => {

    const userModal = document.getElementById('user-modal');
    const userForm = document.getElementById('user-form');
    const weightForm = document.getElementById('weight-form');

    const welcomeHeader = document.getElementById('welcome-header');
    const imcValue = document.getElementById('imc-value');
    const imcDescription = document.getElementById('imc-description');
    const statCount = document.getElementById('stat-count');
    const statMax = document.getElementById('stat-max');
    const statMin = document.getElementById('stat-min');

    async function loadUser() {
        try {
            const response = await fetch('/api/user');
            if (!response.ok) {
                userModal.style.display = 'flex';
                return;
            }
            const user = await response.json();
            welcomeHeader.textContent = `¡Hola, ${user.nombre}!`;
            userModal.style.display = 'none';
        } catch (error) {
            console.error('Error cargando usuario:', error);
        }
    }

    async function loadIMC() {
        try {
            const response = await fetch('/api/imc');
            const data = await response.json();
            imcValue.textContent = data.imc;
            imcDescription.textContent = data.description;
        } catch (error) {
            console.error('Error cargando IMC:', error);
        }
    }

    async function loadStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            statCount.textContent = data.num_pesajes;
            statMax.textContent = data.peso_max + ' kg';
            statMin.textContent = data.peso_min + ' kg';
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }

    function updateDashboard() {
        loadUser();
        loadIMC();
        loadStats();
    }

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            talla_m: document.getElementById('talla_m').value,
        };

        try {
            await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            userModal.style.display = 'none';
            updateDashboard();
        } catch (error) {
            console.error('Error guardando usuario:', error);
        }
    });

    weightForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const peso_kg = document.getElementById('peso').value;
        if (!peso_kg) return;

        try {
            await fetch('/api/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peso_kg: peso_kg })
            });
            document.getElementById('peso').value = '';
            updateDashboard();
        } catch (error) {
            console.error('Error guardando peso:', error);
        }
    });

    updateDashboard();
});


