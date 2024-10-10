let incomeData = [];

document.getElementById('IncomeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const IncomeAmount = parseFloat(document.getElementById('incomeamount').value);
    const IncomeDate = document.getElementById('incomedate').value;
    const IncomeSource = document.getElementById('incomesource').value;

    incomeData.push({ amount: IncomeAmount, date: IncomeDate, source: IncomeSource });
    updateIncomeSummary();
    updateIncomeChart();
    updateIncomeVsExpenseChart();

    document.getElementById('IncomeForm').reset();
});

function updateIncomeSummary() {
    let totalIncome = incomeData.reduce((acc, income) => acc + income.amount, 0);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
}

const incomectx = document.getElementById('Incomesummarysection').getContext('2d');
let Incomesummarysection = new Chart(incomectx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Income',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2

        }]
    }

});

function updateIncomeChart() {
    const incomedates = incomeData.map(income => income.date);
    const incomeamounts = incomeData.map(income => income.amount);

    Incomesummarysection.data.labels = incomedates;
    Incomesummarysection.data.datasets[0].data = incomeamounts;
    Incomesummarysection.update();

}

const IncomeVsSpendingctx = document.getElementById('IncomeExpenseSection').getContext('2d');
let IncomeExpenseSection = new Chart(IncomeVsSpendingctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Income',
                backgroundColor: '#36a2eb',
                data: []
            },
            {
                label: 'Expenses',
                backgroundColor: '#ff6384',
                data: []
            }
        ]
    }
});

function updateIncomeVsExpenseChart() {
    const expenseData = getExpenseData();

    const expenseamounts = expenseData.map(expense => expense.amount);
    const Incomeamounts = incomeData.map(income => income.amount);

    IncomeExpenseSection.data.datasets[0].data = Incomeamounts;
    IncomeExpenseSection.data.datasets[1].data = expenseamounts;
    IncomeExpenseSection.update();
}

fetch('/api/Income', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: IncomeAmount, date: IncomeDate, source: IncomeSource })
})
    .then(response => response.json())
    .then(data => {
        incomeData.push(data);
        alert('Income added successfully');

    })
    .catch(error => {
        console.error('Error adding income:', error);
        alert('Failed to add income data. please try again later.');

    });
