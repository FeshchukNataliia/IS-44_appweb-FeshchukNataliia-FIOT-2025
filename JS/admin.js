// 👇 ПЕРЕВІР, ЧИ ТУТ ТВОЄ ПОСИЛАННЯ (має бути з /api/tickets)
const API_URL = 'https://aquapark-api-nata.onrender.com/api/tickets';

// ==========================================
// 🛡️ 1. ПЕРЕВІРКА БЕЗПЕКИ (Gatekeeper)
// ==========================================
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Якщо токена немає АБО роль не "Admin" — викидаємо звідси
if (!token || role !== 'Admin') {
    alert('Доступ заборонено! Увійдіть як Адміністратор.');
    window.location.href = 'login.html';
}

// ==========================================
// ⚙️ ОСНОВНА ЛОГІКА
// ==========================================

const tableBody = document.getElementById('tickets-table-body');
const formContainer = document.getElementById('create-form');
const form = document.getElementById('ticket-form');

// Глобальна змінна для зберігання квитків (для редагування)
let allTickets = [];

// === Показати/сховати форму ===
function toggleForm() {
    if (formContainer.style.display === 'block') {
        formContainer.style.display = 'none';
    } else {
        formContainer.style.display = 'block';
    }
}

// === READ: Завантажити квитки (Це публічний запит, токен не обов'язковий, але можна додати) ===
async function fetchTickets() {
    try {
        const res = await fetch(API_URL);
        allTickets = await res.json();
        renderTable(allTickets);
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center">Помилка з\'єднання з сервером</td></tr>';
    }
}

// === Рендер таблиці ===
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

// === CREATE: Додати квиток (ЗАХИЩЕНО 🔒) ===
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
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 👈 ПОКАЗУЄМО ПЕРЕПУСТКУ
            },
            body: JSON.stringify(newTicket)
        });

        if (res.ok) {
            alert('Квиток успішно додано!');
            form.reset();
            toggleForm();
            fetchTickets();
        } else {
            const data = await res.json();
            alert('Помилка: ' + (data.error || 'Не вдалося створити'));
        }
    } catch (err) {
        console.error(err);
        alert('Помилка мережі');
    }
});

// === DELETE: Видалити квиток (ЗАХИЩЕНО 🔒) ===
async function deleteTicket(id) {
    if(!confirm('Ви точно хочете видалити цей тариф?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}` // 👈 ПОКАЗУЄМО ПЕРЕПУСТКУ
            }
        });

        if (res.ok) {
            fetchTickets(); // Оновлюємо таблицю
        } else {
            const data = await res.json();
            alert('Помилка: ' + (data.error || 'Не вдалося видалити'));
        }
    } catch (err) {
        console.error(err);
    }
}

// === UPDATE: Редагувати (ЗАХИЩЕНО 🔒) ===
async function editTicket(id) {
    const ticket = allTickets.find(t => t.ticket_type_id === id);
    if (!ticket) return;

    const newName = prompt("Введіть нову назву:", ticket.name);
    if (newName === null) return;

    const newPrice = prompt("Введіть нову ціну:", ticket.base_price);
    if (newPrice === null) return;

    const newDesc = prompt("Введіть новий опис:", ticket.description);
    if (newDesc === null) return;

    if (!newName.trim() || !newPrice.trim()) {
        alert("Назва та ціна не можуть бути пустими!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 👈 ПОКАЗУЄМО ПЕРЕПУСТКУ
            },
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
            const data = await res.json();
            alert('Помилка: ' + (data.error || 'Не вдалося оновити'));
        }
    } catch (err) {
        console.error(err);
        alert('Помилка з\'єднання');
    }
}

// Запуск при старті
fetchTickets();