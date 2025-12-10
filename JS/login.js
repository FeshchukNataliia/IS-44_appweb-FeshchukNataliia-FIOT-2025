const BASE_URL = 'https://aquapark-api-nata.onrender.com';

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.name);
            
            alert(`Вітаємо, ${data.name}!`);
            
            if (data.role === 'Admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            errorMsg.textContent = data.error || 'Помилка входу';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        console.error("Помилка:", err);
        errorMsg.textContent = 'Сервер не відповідає';
        errorMsg.style.display = 'block';
    }
});