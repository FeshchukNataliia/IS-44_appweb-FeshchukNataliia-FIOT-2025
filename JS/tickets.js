// 👇 Встав своє посилання
const API_URL = 'https://aquapark-api-nata.onrender.com/api';

const ticketsList = document.getElementById('tickets-list');
const token = localStorage.getItem('token');

// 1. Перевірка безпеки: Якщо не увійшов - викидаємо на логін
if (!token) {
    window.location.href = 'login.html';
}

// 2. Завантаження квитків
async function loadMyTickets() {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!res.ok) throw new Error('Помилка сервера');
        
        const orders = await res.json();

        if (orders.length === 0) {
            ticketsList.innerHTML = `
                <div style="text-align: center; padding: 40px; background: white; border-radius: 10px;">
                    <h3>У вас ще немає квитків 😔</h3>
                    <a href="index.html" class="btn-login" style="display:inline-block; margin-top:10px;">Перейти до тарифів</a>
                </div>
            `;
            return;
        }

        ticketsList.innerHTML = ''; // Очищаємо контейнер

        orders.forEach(order => {
            // Форматуємо дату
            const dateObj = new Date(order.visit_date);
            const dateStr = dateObj.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

            // Створюємо картку квитка
            const card = document.createElement('div');
            card.className = 'ticket-item'; // Клас для стилів (додамо нижче)
            
            card.innerHTML = `
                <div class="ticket-info">
                    <h3>${order.name}</h3>
                    <p class="ticket-date">📅 Дата візиту: <strong>${dateStr}</strong></p>
                    <p class="ticket-price">Ціна: ${order.base_price} грн</p>
                </div>
                <div class="ticket-status">
                    <span class="status-badge status-active">✅ Активний</span>
                    <p style="font-size: 0.8rem; color: gray; margin-top: 5px;">ID: #${order.ticket_id}</p>
                </div>
            `;
            ticketsList.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        ticketsList.innerHTML = '<p style="text-align:center; color:red;">Не вдалося завантажити квитки.</p>';
    }
}

// 3. Функція виходу (для кнопки в хедері)
window.logout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
};

// Запуск
loadMyTickets();