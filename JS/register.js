const BASE_URL = 'https://aquapark-api-nata.onrender.com';
const errorMsg = document.getElementById('error-message');

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorMsg.style.display = 'none';

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Реєстрація успішна! Тепер увійдіть.');
            window.location.href = 'login.html';
        } else {
            errorMsg.textContent = data.error || 'Помилка реєстрації';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'Сервер не відповідає';
        errorMsg.style.display = 'block';
    }
});