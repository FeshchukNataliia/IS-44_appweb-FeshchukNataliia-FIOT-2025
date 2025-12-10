const API_URL = 'https://aquapark-api-nata.onrender.com/api';

const tariffsContainer = document.getElementById('tariffs-container');
const authMenu = document.getElementById('auth-menu');

// Дані користувача з пам'яті
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');

// ==========================================
// 1. ПЕРЕВІРКА СТАТУСУ (Шапка сайту)
// ==========================================
function checkAuth() {
    if (token) {
        // --- ВАРІАНТ ДЛЯ УВІЙШЛИХ ---
        
        // Якщо Адмін - показуємо червону кнопку адмінки
        let adminBtn = '';
        if (role === 'Admin') {
            adminBtn = `<a href="admin.html" style="margin-right:10px; color: #dc3545; font-weight:bold; text-decoration:none; border: 1px solid #dc3545; padding: 5px 10px; border-radius: 5px;">⚙️ Адмін</a>`;
        }

        authMenu.innerHTML = `
            <span style="margin-right: 15px; font-weight: bold; color: var(--primary-dark-blue);">Привіт, ${username}!</span>
            ${adminBtn}
            
            <a href="tickets.html" class="btn-login" style="margin-right: 10px; text-decoration:none; background-color: var(--primary-dark-blue);">🎫 Мої квитки</a>
            
            <button onclick="logout()" class="btn-login" style="background: #6c757d;">Вийти</button>
        `;
    } else {
        // --- ВАРІАНТ ДЛЯ ГОСТЕЙ ---
        authMenu.innerHTML = `<a href="login.html" class="btn-login">Увійти</a>`;
    }
}

// ==========================================
// 2. ЗАВАНТАЖЕННЯ ТАРИФІВ (GET)
// ==========================================
async function loadTariffs() {
    try {
        const res = await fetch(`${API_URL}/tickets`);
        const tickets = await res.json();
        
        tariffsContainer.innerHTML = '';

        tickets.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'tariff-card'; // Твої стилі карток
            card.innerHTML = `
                <h3 class="card-title">${ticket.name}</h3>
                <p class="card-price">${ticket.base_price} грн</p>
                <p class="card-description">${ticket.description || ''}</p>
                
                <button class="btn btn-buy" onclick="buyTicket(${ticket.ticket_type_id})">Купити квиток</button>
            `;
            tariffsContainer.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        tariffsContainer.innerHTML = '<p>Не вдалося завантажити тарифи.</p>';
    }
}

// ==========================================
// 3. ПОКУПКА КВИТКА (POST)
// ==========================================
window.buyTicket = async function(ticketId) {
    // 1. Перевірка: чи увійшов юзер?
    if (!token) {
        alert("Щоб купити квиток, будь ласка, увійдіть або зареєструйтеся!");
        window.location.href = 'login.html';
        return;
    }

    // 2. Запитуємо дату (простеньке віконце)
    const date = prompt("Введіть дату візиту (РРРР-ММ-ДД):", new Date().toISOString().slice(0, 10));
    if (!date) return; // Натиснули "Скасувати"

    try {
        // 3. Відправляємо запит на сервер
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 🔑 Обов'язково показуємо токен
            },
            body: JSON.stringify({ 
                ticket_type_id: ticketId, 
                visit_date: date 
            })
        });

        if (res.ok) {
            if(confirm("✅ Оплата успішна! Переглянути квиток в кабінеті?")) {
                window.location.href = 'tickets.html';
            }
        } else {
            alert("Помилка покупки. Спробуйте пізніше.");
        }
    } catch (err) {
        console.error(err);
        alert("Помилка з'єднання.");
    }
};

// ==========================================
// 4. ВИХІД
// ==========================================
window.logout = function() {
    localStorage.clear();
    window.location.reload();
};

// Запуск при старті
checkAuth();
loadTariffs();