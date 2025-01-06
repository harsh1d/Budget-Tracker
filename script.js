// Initialize the transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const totalBalanceElement = document.getElementById('totalBalance');
const totalIncomeElement = document.getElementById('totalIncome');
const totalExpensesElement = document.getElementById('totalExpenses');

// Update the UI with current transactions
function updateUI() {
    // Calculate totals
    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            acc.income += transaction.amount;
        } else {
            acc.expenses += transaction.amount;
        }
        return acc;
    }, { income: 0, expenses: 0 });

    const balance = totals.income - totals.expenses;

    // Update summary amounts
    totalBalanceElement.textContent = formatAmount(balance);
    totalIncomeElement.textContent = formatAmount(totals.income);
    totalExpensesElement.textContent = formatAmount(totals.expenses);

    // Clear transaction list
    transactionList.innerHTML = '';

    // Add transaction items
    transactions.forEach((transaction, index) => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        const isIncome = transaction.type === 'income';
        const icon = isIncome ? 'arrow_upward' : 'arrow_downward';
        const amountClass = isIncome ? 'income-amount' : 'expense-amount';

        transactionElement.innerHTML = `
            <div class="transaction-info">
                <span class="material-icons">${icon}</span>
                <span>${transaction.description}</span>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${formatAmount(transaction.amount)}
                <span class="material-icons delete-btn" onclick="deleteTransaction(${index})">delete</span>
            </div>
        `;

        transactionList.appendChild(transactionElement);
    });

    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format amount as currency
function formatAmount(amount) {
    return '$' + amount.toFixed(2);
}

// Add new transaction
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: new Date().toISOString()
    };

    transactions.unshift(transaction);
    updateUI();

    // Reset form
    transactionForm.reset();
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Event listeners
transactionForm.addEventListener('submit', addTransaction);

// Initial UI update
updateUI();
