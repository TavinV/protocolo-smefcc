// Simulação de dados para demonstração
let employees = [
    { id: 1, name: "João Silva", cpf: "123.456.789-00", rfid: "A1B2C3D4", role: "pedreiro" },
    { id: 2, name: "Maria Santos", cpf: "987.654.321-00", rfid: "E5F6G7H8", role: "eletricista" }
];

let items = [
    { id: 1, name: "Martelo", type: "ferramenta", brand: "Tramontina", model: "Profissional", description: "Martelo de unha 500g", quantity: 5, available: true },
    { id: 2, name: "Capacete", type: "epi", brand: "3M", model: "Segurança", description: "Capacete de segurança amarelo", quantity: 10, available: true }
];

let transactions = [
    { id: 1, timestamp: "2024-01-15 08:30:00", employee: "João Silva", cpf: "123.456.789-00", item: "Martelo", type: "retirada", status: "concluído" },
    { id: 2, timestamp: "2024-01-15 12:45:00", employee: "Maria Santos", cpf: "987.654.321-00", item: "Capacete", type: "retirada", status: "concluído" }
];

// Funções de navegação
function navigateTo(page) {
    window.location.href = page;
}

function logout() {
    if (confirm("Deseja realmente sair do sistema?")) {
        window.location.href = "index.html";
    }
}

// Simulação de leitor RFID
function simulateRFIDScan() {
    const scanner = document.getElementById('rfid-scanner');
    const rfidCode = document.getElementById('rfid-code');
    const rfidInput = document.getElementById('employee-rfid');
    
    if (scanner && !scanner.classList.contains('active')) {
        scanner.classList.add('active');
        rfidCode.textContent = "Lendo...";
        
        // Simula a leitura do RFID após 2 segundos
        setTimeout(() => {
            const randomRFID = 'RFID' + Math.random().toString(36).substr(2, 8).toUpperCase();
            rfidCode.textContent = randomRFID;
            if (rfidInput) {
                rfidInput.value = randomRFID;
            }
        }, 2000);
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na página de login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Simulação de login bem-sucedido
                window.location.href = 'dashboard.html';
            });
        }
    }
    
    // Inicializa a página de funcionários
    if (window.location.pathname.includes('employees.html')) {
        initializeEmployeesPage();
        // Simula o scanner RFID
        const scanner = document.getElementById('rfid-scanner');
        if (scanner) {
            scanner.addEventListener('click', simulateRFIDScan);
        }
    }
    
    // Inicializa a página de dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
    
    // Inicializa a página de transações
    if (window.location.pathname.includes('transactions.html')) {
        initializeTransactionsPage();
    }
    
    // Inicializa a página de itens
    if (window.location.pathname.includes('items.html')) {
        initializeItemsPage();
    }
});

// Funções específicas para cada página
function initializeDashboard() {
    updateDashboardStats();
    loadRecentActivity();
}

function initializeEmployeesPage() {
    loadEmployeesTable();
    
    const employeeForm = document.getElementById('employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addEmployee();
        });
    }
}

function initializeTransactionsPage() {
    loadTransactionsTable();
    
    // Preenche o filtro de funcionários
    const employeeFilter = document.getElementById('filter-employee');
    if (employeeFilter) {
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = emp.name;
            employeeFilter.appendChild(option);
        });
    }
}

function initializeItemsPage() {
    loadItemsTable();
    
    const itemForm = document.getElementById('item-form');
    if (itemForm) {
        itemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addItem();
        });
    }
}

// Funções para atualizar dados
function updateDashboardStats() {
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('total-items').textContent = items.length;
    document.getElementById('today-transactions').textContent = transactions.filter(t => 
        t.timestamp.includes('2024-01-15')
    ).length;
    document.getElementById('pending-returns').textContent = 2; // Exemplo
}

function loadRecentActivity() {
    const tableBody = document.querySelector('#recent-activity tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        transactions.slice(0, 5).forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.timestamp}</td>
                <td>${transaction.employee}</td>
                <td>${transaction.item}</td>
                <td><span class="badge ${transaction.type === 'retirada' ? 'badge-warning' : 'badge-success'}">${transaction.type}</span></td>
                <td><span class="badge badge-success">${transaction.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function loadEmployeesTable() {
    const tableBody = document.querySelector('#employees-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.cpf}</td>
                <td>${employee.rfid}</td>
                <td>${employee.role}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function loadTransactionsTable() {
    const tableBody = document.querySelector('#transactions-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.timestamp}</td>
                <td>${transaction.employee}</td>
                <td>${transaction.cpf}</td>
                <td>${transaction.item}</td>
                <td><span class="badge ${transaction.type === 'retirada' ? 'badge-warning' : 'badge-success'}">${transaction.type}</span></td>
                <td><span class="badge badge-success">${transaction.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function loadItemsTable() {
    const tableBody = document.querySelector('#items-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td><span class="badge ${getItemTypeBadge(item.type)}">${item.type}</span></td>
                <td>${item.brand} ${item.model}</td>
                <td>${item.description}</td>
                <td><span class="badge ${item.available ? 'badge-success' : 'badge-danger'}">${item.available ? 'Sim' : 'Não'}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function getItemTypeBadge(type) {
    switch(type) {
        case 'ferramenta': return 'badge-info';
        case 'epi': return 'badge-warning';
        case 'material': return 'badge-success';
        default: return 'badge-secondary';
    }
}

// Funções para adicionar dados
function addEmployee() {
    const name = document.getElementById('employee-name').value;
    const cpf = document.getElementById('employee-cpf').value;
    const rfid = document.getElementById('employee-rfid').value;
    const role = document.getElementById('employee-role').value;
    
    if (!name || !cpf || !rfid || !role) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    const newEmployee = {
        id: employees.length + 1,
        name,
        cpf,
        rfid,
        role
    };
    
    employees.push(newEmployee);
    loadEmployeesTable();
    document.getElementById('employee-form').reset();
    
    // Reset RFID scanner
    const scanner = document.getElementById('rfid-scanner');
    const rfidCode = document.getElementById('rfid-code');
    if (scanner) scanner.classList.remove('active');
    if (rfidCode) rfidCode.textContent = '---';
    
    alert('Funcionário cadastrado com sucesso!');
}

function addItem() {
    const name = document.getElementById('item-name').value;
    const type = document.getElementById('item-type').value;
    const brand = document.getElementById('item-brand').value;
    const model = document.getElementById('item-model').value;
    const description = document.getElementById('item-description').value;
    const quantity = document.getElementById('item-quantity').value;
    const available = document.getElementById('item-available').value === 'true';
    
    if (!name || !type) {
        alert('Preencha os campos obrigatórios!');
        return;
    }
    
    const newItem = {
        id: items.length + 1,
        name,
        type,
        brand,
        model,
        description,
        quantity: parseInt(quantity),
        available
    };
    
    items.push(newItem);
    loadItemsTable();
    document.getElementById('item-form').reset();
    
    alert('Item cadastrado com sucesso!');
}

// Funções de utilidade
function refreshEmployees() {
    loadEmployeesTable();
    alert('Lista de funcionários atualizada!');
}

function refreshTransactions() {
    loadTransactionsTable();
    alert('Lista de transações atualizada!');
}

function refreshItems() {
    loadItemsTable();
    alert('Lista de itens atualizada!');
}

function applyFilters() {
    // Implementar lógica de filtros
    alert('Filtros aplicados!');
}

function exportTransactions() {
    alert('Exportando transações...');
    // Implementar lógica de exportação
}

// Funções de edição/exclusão (simuladas)
function editEmployee(id) {
    alert(`Editando funcionário ID: ${id}`);
}

function deleteEmployee(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        employees = employees.filter(emp => emp.id !== id);
        loadEmployeesTable();
        alert('Funcionário excluído com sucesso!');
    }
}

function editItem(id) {
    alert(`Editando item ID: ${id}`);
}

function deleteItem(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        items = items.filter(item => item.id !== id);
        loadItemsTable();
        alert('Item excluído com sucesso!');
    }
}