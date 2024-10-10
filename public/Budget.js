function updateBudgetProgress(category, spent, budget) {
    const percentage = Math.min((spent / budget) * 100, 100);  // Limit to 100%
    $(`#${category}food-progress`).css('width', `${percentage}%`);
    $(`#${category}food-spent`).text(`Spent: $${spent}`);
    $(`#${category}food-budget`).text(`Budget: $${budget}`);
    $(`#${category}rent-progress`).css('width', `${percentage}%`);
    $(`#${category}rent-spent`).text(`Spent: $${spent}`);
    $(`#${category}rent-budget`).text(`Budget: $${budget}`);
    $(`#${category}transport-progress`).css('width', `${percentage}%`);
    $(`#${category}transport-spent`).text(`Spent: $${spent}`);
    $(`#${category}transport-budget`).text(`Budget: $${budget}`);
    $(`#${category}entertainment-progress`).css('width', `${percentage}%`);
    $(`#${category}entertainment-spent`).text(`Spent: $${spent}`);
    $(`#${category}entertainment-budget`).text(`Budget: $${budget}`);
    $(`#${category}electricity-progress`).css('width', `${percentage}%`);
    $(`#${category}electricity-spent`).text(`Spent: $${spent}`);
    $(`#${category}electricity-budget`).text(`Budget: $${budget}`);
    $(`#${category}travel-progress`).css('width', `${percentage}%`);
    $(`#${category}travel-spent`).text(`Spent: $${spent}`);
    $(`#${category}travel-budget`).text(`Budget: $${budget}`);
    $(`#${category}others-progress`).css('width', `${percentage}%`);
    $(`#${category}others-spent`).text(`Spent: $${spent}`);
    $(`#${category}others-budget`).text(`Budget: $${budget}`);

    if (percentage < 50) {
        $(`#${category}food-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}food-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}food-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}rent-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}rent-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}rent-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}transport-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}transport-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}transport-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}entertainment-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}entertainment-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}entertainment-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}electricity-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}electricity-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}electricity-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}travel-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}travel-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}travel-progress`).css('background-color', 'red');
    }

    if (percentage < 50) {
        $(`#${category}others-progress`).css('background-color', 'green');
    } else if (percentage >= 50 && percentage < 90) {
        $(`#${category}others-progress`).css('background-color', 'yellow');
    } else {
        $(`#${category}others-progress`).css('background-color', 'red');
    }
}

function updateExpensechart(expensedata) {
    const categoryTotals = {
        'Food': 0,
        'Rent': 0,
        'Transport': 0,
        'Entertainment': 0,
        'Electricity': 0,
        'Travel': 0,
        'Others': 0
    };

    expensedata.forEach(expense => {
        categoryTotals[expense.category] += parseFloat(expense.amount);
    });

    const chartData = Object.values(categoryTotals);

    budgetChart.data.datasets[0].data = chartData;
    budgetChart.update();
}

const ctx = document.getElementById('budgetChart').getContext('2d');
const budgetChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Rent', 'Transport', 'Entertainment', 'Electricity', 'Travel', 'Others'],
        datasets: [{
            label: 'Budget Allocation',
            data: [],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', 'green', 'blue', 'Teal', 'Yellow']
        }]
    }
});

const budgetData = [foodBudget, rentBudget, transportBudget, entertainmentBudget, electricityBudget, travelBudget, otherBudget];  // Populate with real data
budgetChart.data.datasets[0].data = budgetData;
budgetChart.update();  // Update chart dynamically


const comparisonCtx = document.getElementById('budgetVsSpending').getContext('2d');
const comparisonChart = new Chart(comparisonCtx, {
    type: 'bar',
    data: {
        labels: ['Food', 'Rent', 'Transport', 'Entertainment', 'Electricity', 'Travel', 'Others'],
        datasets: [
            {
                label: 'Budget',
                backgroundColor: '#36a2eb',
                data: []
            },
            {
                label: 'Spent',
                backgroundColor: '#ff6384',
                data: []
            }
        ]
    }
});


$('#budgetForm').on('submit', function (e) {
    e.preventDefault();

    const budgetData = {
        food: $('#foodBudget').val(),
        rent: $('#rentBudget').val(),
        entertainment: $('#entertainmentBudget').val(),
        electricity: $('#electricityBudget').val(),
        transport: $('#transportBudget').val(),
        travel: $('#travelBudget').val(),
        other: $('#othersBudget').val()

    };

    if (!budgetData.food || budgetData.food <= 0) {
        alert('Please enter a valid budget for Food.');
        return;
    }

    if (!budgetData.rent || budgetData.rent <= 0) {
        alert('Please enter a valid budget for Rent.');
        return;
    }

    if (!budgetData.entertainment || budgetData.entertainment <= 0) {
        alert('Please enter a valid budget for Entertainment.');
        return;
    }

    if (!budgetData.electricity || budgetData.electricity <= 0) {
        alert('Please enter a valid budget for Electricity.');
        return;
    }

    if (!budgetData.transport || budgetData.transport <= 0) {
        alert('Please enter a valid budget for Transport.');
        return;
    }

    if (!budgetData.travel || budgetData.travel <= 0) {
        alert('Please enter a valid budget for Travel.');
        return;
    }

    if (!budgetData.other || budgetData.other <= 0) {
        alert('Please enter a valid budget for Other.');
        return;
    }

    $.ajax({
        url: '/api/Budget',
        method: 'POST',
        data: budgetData,
        success: function (response) {
            alert('Budget saved successfully');
            updateBudgetUI(budgetData);
        },
        error: function (err) {
            alert('Error saving budget');
        }
    });
});

function loadBudgetData() {
    $.ajax({
        url: '/api/Budget',  // Replace with the actual API to get budget data
        method: 'GET',
        success: function (response) {
            // Update charts, progress bars, and the budget form with data
            updateBudgetUI(response);
        },
        error: function (err) {
            console.log('Error loading budget data:', err);
        }
    });
}

function updateBudgetUI(data) {
    const categories = ['food', 'rent', 'transport', 'entertainment', 'electricity', 'travel', 'other'];
    categories.forEach(category => {
        const spent = budgetData[`${category}`].spent;
        const budget = budgetData[`${category}`].budget;
        updateBudgetProgress(category, spent, budget);
    });
}

function checkBudgetWarnings(budgetData) {
    const categories = ['food', 'rent', 'transport', 'entertainment', 'electricity', 'travel', 'other'];

    categories.forEach(category => {
        const spent = budgetData[`${category}`].spent;
        const budget = budgetData[`${category}`].budget;

        if (spent >= budget * 0.9) {  // If spending is 90% or more of the budget
            alert(`Warning: You are approaching your budget for ${category.charAt(0).toUpperCase() + category.slice(1)}!`);
        }
    });
}





