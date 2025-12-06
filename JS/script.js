/* * script.js - Мозок нашого сайту
 * Цей код завантажує дані з сервера і малює HTML
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Знаходимо контейнер, куди будемо вставляти картки
    const container = document.getElementById('tariffs-container');

    // 2. Адреса нашого хмарного "Офіціанта" (Бекенду)
    const API_URL = 'https://aquapark-api-nata.onrender.com/api/tickets'; 

    // 3. Функція для отримання даних
    async function fetchTariffs() {
        try {
            // Робимо запит до сервера
            const response = await fetch(API_URL);

            // Якщо сервер відповів помилкою (напр. 404 або 500)
            if (!response.ok) {
                throw new Error('Не вдалося отримати дані');
            }

            // Перетворюємо відповідь у зрозумілий масив (JSON)
            const tickets = await response.json();

            // Викликаємо функцію, яка намалює картки
            renderTickets(tickets);

        } catch (error) {
            console.error('Помилка:', error);
            container.innerHTML = '<p style="color: red; text-align: center;">Вибачте, сервіс тимчасово недоступний.</p>';
        }
    }

    // 4. Функція для малювання HTML (Рендер)
    function renderTickets(tickets) {
        // Очищаємо текст "Завантаження..."
        container.innerHTML = '';

        // Перебираємо кожен квиток, який прийшов з бази
        tickets.forEach(ticket => {
            // Створюємо елемент div
            const card = document.createElement('div');
            
            // Додаємо йому твій клас стилів (CSS не міняємо!)
            card.className = 'tariff-card'; 

            // Наповнюємо HTML всередині картки
            // Ми беремо дані: ticket.name, ticket.base_price, ticket.description
            card.innerHTML = `
                <h3 class="card-title">${ticket.name}</h3>
                <p class="card-price">Від ${ticket.base_price} грн</p>
                <p class="card-description">${ticket.description || 'Опис відсутній'}</p>
                <button class="btn btn-buy">Купити квиток</button>
            `;

            // Додаємо готову картку в контейнер на сторінці
            container.appendChild(card);
        });
    }

    // 5. Запускаємо процес!
    fetchTariffs();
});