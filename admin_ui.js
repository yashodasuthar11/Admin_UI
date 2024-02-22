let currentPage = 1;
const itemsPerPage = 10; 

async function getUsers() {
    try {
        let res = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderUsers(page) {
    let users = await getUsers();
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let paginatedUsers = users.slice(startIndex, endIndex);

    let html = `
        <table>
            <thead>
                <tr>
                    <th><i class="fa-regular fa-square"></i></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>`;

    paginatedUsers.forEach((user, index) => {
        html += `
            <tr class="user" id="edit">
                <td><input type="checkbox" class="check" value="${user.id}"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td id="icons">
                    <a href="#" onclick="updateRow(this)"><i class="fa-solid fa-pen-to-square"></i></a>
                    <a href="#" onclick="deleteRow(this)"><i class="fa-solid fa-trash" id="trash"></i></a>
                </td>
            </tr>`;
    });

    html += `
            </tbody>
        </table>`;

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

async function deleteSelected() {
    let checkboxes = document.querySelectorAll('.check:checked');

    checkboxes.forEach(checkbox => {
        var row = checkbox.parentElement.parentElement;
        row.remove();
    });
}

async function updateRow(link) {
    let row = link.closest('tr');
    let cells = row.cells;
    let newName = prompt("Enter new name for " + cells[1].textContent + ":");
    let newEmail = prompt("Enter new email for " + cells[2].textContent + ":");
    let newRole = prompt("Enter new role for " + cells[3].textContent + ":");

    cells[1].textContent = newName;
    cells[2].textContent = newEmail;
    cells[3].textContent = newRole;
}

async function deleteRow(link) {
    let row = link.closest('tr');
    row.remove();
}

function setPage(page) {
    currentPage = page;
    renderUsers(currentPage);
    updatePagination();
}

async function updatePagination() {
    let users = await getUsers();
    let totalPages = Math.ceil(users.length / itemsPerPage);

    let pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        let li = document.createElement('li');
        li.textContent = i;
        li.addEventListener('click', () => setPage(i));
        if (i === currentPage) {
            li.classList.add
            li.classList.add('active');
        }
        pagination.appendChild(li);
    }
}

renderUsers(currentPage);
updatePagination();
