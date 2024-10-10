function updateExpenseChart(expenseData) {
    const categoryTotals = {
        'Food': 0,
        'Rent': 0,
        'Transport': 0,
        'Entertainment': 0,
        'Electricity': 0,
        'Travel': 0,
        'Others': 0
    };

    expenseData.forEach(expense => {
        categoryTotals[expense.category] += parseFloat(expense.amount);
    });

    const chartData = Object.values(categoryTotals);

    chart.data.datasets[0].data = chartData;
    chart.update();
}

const ctx = document.getElementById('expenseChart').getContext('2d')
const chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Rent', 'Transport', 'Entertainment', 'Electricity', 'Travel', 'Others'],
        datasets: [{
            label: 'Expenses by Category',
            data: [],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', 'Teal', 'Red', 'Green', 'Blue']
        }]

    }
});

$('#filterbtn').on('click', function () {
    const search = $('#searchInput').val();
    const category = $('#CategoryFilter').val();

    $.ajax({
        url: `/api/expenses?search=${search}&category=${category}`,
        method: 'GET',
        success: function (data) {
            let rows = '';
            data.forEach(expense => {
                rows += `
                <tr>
                    <td>${expense.date}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>
                        <button class="edit-btn" data-id="${expense.id}">Edit</button>
                        <button class="delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                </tr>`;
            });
            $('#expense-rows').html(rows);
            updateExpenseChart(data);
        },
        error: function (err) {
            alert('Error Filtering Expenses');
        }

    });
});

$('#quickAddExpenseForm').on('submit', function (e) {
    e.preventDefault();

    const formData = {
        amount: $('#quickAmount').val(),
        category: $('#quickCategory').val(),
        date: $('#quickdate').val(),
    };
    $.ajax({
        url: '/api/expenses',
        method: 'POST',
        data: formData,
        success: function (response) {
            alert('Expense Added Successfully');
            loadExpenses();
            updateExpenseChart(response.expenses);
        },
        error: function (err) {
            alert('Error Adding Expenses');
        }
    });

});

if (!formData.amount || formData.amount <= 0) {
    alert('Please enter a valid amount.');
    return;
}
if (!formData.date) {
    alert('Please select a valid date.');
    return;
}

function loadExpenses() {
    $.ajax({
        url: '/api/expenses',
        method: 'GET',
        success: function (data) {
            let rows = ' ';
            data.forEach(expense => {
                rows += `
                <tr>
                <td>${expense.date}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
                </tr>`;
            });
            $('#expense-rows').html(rows);
            updateExpenseChart(data);
        },
        error: function (err) {
            alert('Error Loading Expenses');
        }

    });

}
