const { Chart } = require("chart.js");
const { response } = require("express");

document.getElementById('filter-row').addEventListener('submit', function (e) {
    e.preventDefault();

    const startDate = document.getElementById('startdate').value;
    const endDate = document.getElementById('enddate').value;
    const category = document.getElementById('category').value;

    fetch(`/api/Reports?startDate=${startDate}&endDate=${endDate}&Category=${category}`)

        .then(response => response.json())
        .then(data => {
            updateCategoryBreakownChart(data.categoryBreakdown);
            updateMonthlySpendingChart(data.Monthlyspending);
            updateSpendingVSBudgetChart(data.SpendingBudget);

        })
        .catch(error => {
            console.error('Error Fetching Report Data:', error);
            alert('Failed to fetch report data. please try again later.');


        });

});
const categoryctx = document.getElementById('categorywisebreakdown').getContext('2d');
let categorywisebreakdown = new Chart(categoryctx, {
    type: 'pie',
    data: {
        labels: ['Food', 'Rent', 'Transport', 'Entertainment', 'Electricity', 'Travel', 'Others'],
        datasets: [{
            label: 'Expenses By Category',
            data: [],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71', '#f39c12', '#e74c3c']
        }]
    }
});

function updateCategoryBreakownChart(categoryData) {
    categorywisebreakdown.data.datasets[0].data = categoryData;
    categorywisebreakdown.update();
}

const monthlyctx = document.getElementById('monthlyspending').getContext('2d');
let monthlyspending = new Chart(monthlyctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Monthly Spending Trends',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    }
});

function updateMonthlySpendingChart(monthlyData) {
    monthlyspending.data.labels = monthlyData.months;
    monthlyspending.data.datasets[0].monthlyData.spending;
    monthlyspending.update();

}

const spendingctx = document.getElementById('spendingbudget').getContext('2d');
let spendingbudget = new Chart(spendingctx, {
    type: 'bar',
    data: {
        labels: ['Food', 'Rent', 'Transport', 'Entertainment', 'Electricity', 'Travel', 'Others'],
        datasets: [
            {
                label: 'Budget',
                data: [],
                backgroundColor: '#36a2eb',
            },
            {
                label: 'Spending',
                data: [],
                backgroundColor: '#ff6384',
            }
        ]
    }
});

function updateSpendingVSBudgetChart(spendingVsBudgetData) {
    spendingbudget.data.datasets[0].data = spendingVsBudgetData.budget;
    spendingbudget.data.datasets[1].data = spendingVsBudgetData.spent;
    spendingbudget.update();

}