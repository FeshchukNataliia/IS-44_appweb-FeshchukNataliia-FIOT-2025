// 👇 ВСТАВ СЮДИ СВОЄ ПОСИЛАННЯ З RENDER!
const API_URL = 'https://aquapark-api-nata.onrender.com/api/tickets';

const tableBody = document.getElementById('tickets-table-body');
const formContainer = document.getElementById('create-form');
const form = document.getElementById('ticket-form');

// Глобальна змінна для зберігання квитків
let allTickets = [];

// === 1. Функція показати/сховати форму ===
function toggleForm() {
    if (formContainer.style.display === 'block') {
        formContainer.style.display = 'none';
    } else {
        formContainer.style.display = 'block';
    }
}

// === 2. READ: Завантажити квитки ===
async function fetchTickets() {
    try {
        const res = await fetch(API_URL);
        // Зберігаємо отримані квитки у глобальну змінну
        allTickets = await res.json();
        renderTable(allTickets);
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center">Помилка з\'єднання з сервером</td></tr>';
    }
}

// === 3. Рендер таблиці ===
function renderTable(tickets) {
    tableBody.innerHTML = ''; 
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${ticket.ticket_type_id}</td>
            <td><strong>${ticket.name}</strong></td>
            <td>${ticket.description || '-'}</td>
            <td>${ticket.base_price} грн</td>
            <td class="table-actions">
                <button class="btn-action btn-edit" onclick="editTicket(${ticket.ticket_type_id})" title="Редагувати">✎</button>
                <button class="btn-action btn-delete" onclick="deleteTicket(${ticket.ticket_type_id})" title="Видалити">🗑</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// === 4. CREATE: Додати квиток ===
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newTicket = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        base_price: document.getElementById('price').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket)
        });

        if (res.ok) {
            alert('Квиток успішно додано!');
            form.reset();
            toggleForm();
            fetchTickets();
        } else {
            alert('Помилка при створенні');
        }
    } catch (err) {
        console.error(err);
        alert('Помилка мережі');
    }
});

// === 5. DELETE: Видалити квиток ===
async function deleteTicket(id) {
    if(!confirm('Ви точно хочете видалити цей тариф?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            fetchTickets();
        } else {
            alert('Не вдалося видалити. Можливо, є залежні дані.');
        }
    } catch (err) {
        console.error(err);
    }
}

// === 6. UPDATE: Редагувати (РОЗУМНЕ РЕДАГУВАННЯ) ===
async function editTicket(id) {
    // Знаходимо квиток у пам'яті за його ID
    const ticket = allTickets.find(t => t.ticket_type_id === id);
    
    // Якщо чомусь не знайшли - виходимо
    if (!ticket) return;

    // 1. Запитуємо Назву (показуємо стару як підказку)
    const newName = prompt("Введіть нову назву:", ticket.name);
    if (newName === null) return; // Натиснули "Скасувати"

    // 2. Запитуємо Ціну (показуємо стару)
    const newPrice = prompt("Введіть нову ціну:", ticket.base_price);
    if (newPrice === null) return;

    // 3. Запитуємо Опис (показуємо старий)
    const newDesc = prompt("Введіть новий опис:", ticket.description);
    if (newDesc === null) return;

    // Валідація: якщо стерли ціну або назву — сваримося
    if (!newName.trim() || !newPrice.trim()) {
        alert("Назва та ціна не можуть бути пустими!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newName,
                base_price: newPrice,
                description: newDesc
            })
        });

        if (res.ok) {
            alert('Квиток успішно оновлено!');
            fetchTickets();
        } else {
            alert('Помилка оновлення на сервері (перевірте консоль)');
        }
    } catch (err) {
        console.error(err);
        alert('Помилка з\'єднання');
    }
}

// Запуск при старті
fetchTickets();