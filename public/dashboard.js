const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql'); // Assuming MySQL is used
const bodyParser = require('body-parser');
const cors = require('cors'); // if needed
require('dotenv').config();  // to load environment variables like ACCESS_TOKEN_SECRET

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn1').addEventListener('click', function () {
        window.location.href = 'Registration.html';
        console.log('Register button clicked');
    });

    document.getElementById('btn2').addEventListener('click', function () {
        window.location.href = 'login.html';
        console.log('Login button clicked');
    });
});

const token = localStorage.getItem('authToken');

// Function to show loading state
const setLoadingState = () => {
    document.getElementById('total-expenses').innerText = 'Loading...';
    document.getElementById('total-income').innerText = 'Loading...';
    document.getElementById('remaining-budget').innerText = 'Loading...';
    document.getElementById('net-income').innerText = 'Loading...';
};

// Set initial loading state
setLoadingState();

fetchData();

function fetchData() {
    Promise.all([
        fetchExpenses(),
        fetchIncome(),
        fetchBudget(),
        fetchNetIncome()
    ]).catch(err => {
        console.error('Error fetching data:', err);
        showError('Error fetching dashboard data');
    });

}

function fetchExpenses() {
    fetch('http://localhost:3000/api/Expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch expenses');
            return response.json();
        })
        .then(data => {
            // process data
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}


// Fetch Income
function fetchIncome() {
    return fetch('http://localhost:3000/api/Income', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            let totalIncome = data.reduce((sum, income) => sum + income.amount, 0);
            document.getElementById('total-income').innerText = `$${totalIncome.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error fetching income:', error);
            document.getElementById('total-income').innerText = 'Error';
        });
}

// Fetch Budget and Remaining Budget
function fetchBudget() {
    return fetch('http://localhost:3000/api/Budget', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(budgetData => {
            let totalBudget = budgetData[0]?.totalBudget || 0;
            return totalBudget;
        })
        .catch(error => {
            console.error('Error fetching budget:', error);
            document.getElementById('remaining-budget').innerText = 'Error';
        });
}

// Fetch Net Income
function fetchNetIncome() {
    return fetch('http://localhost:3000/api/net-income', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('net-income').innerText = `$${data.net_income.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error fetching net income:', error);
            document.getElementById('net-income').innerText = 'Error';
        });
}

// Show Error
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

document.getElementById('expenseForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Form Submitted'); // Check if this logs

    const expense = {
        description: document.getElementById('description').value,
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value
    };

    console.log(expense); // Check if form data is correct

    fetch('http://localhost:3000/api/Expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expense)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit expense');
            }
            return response.json();
        })
        .then(data => {
            console.log('Expense added:', data);
            updateDashboard();  // Ensure the dashboard gets updated
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('errorMessage').style.display = 'block';  // Show error
        });

});


function updateDashboard() {
    fetch('http://localhost:3000/api/financial-summary', {
        headers: {
            'Authorization': `Bearer ${token}`  // Authorization header for the summary endpoint
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch financial summary');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('total-expenses').textContent = `$${data.totalExpenses}`;
            document.getElementById('total-income').textContent = `$${data.totalIncome}`;
            document.getElementById('remaining-budget').textContent = `$${data.remainingBudget}`;
            document.getElementById('net-income').textContent = `$${data.netIncome}`;
        })
        .catch(error => {
            console.error('Error updating dashboard:', error);
            alert('Failed to update dashboard data. please try again');
        });
}
function getFinancialData(userId, cb) {
    const query = `
        SELECT 
            (SELECT SUM(amount) FROM Income WHERE user_id = ?) AS total_income,
            (SELECT SUM(amount) FROM Expenses WHERE user_id = ?) AS total_expenses;
    `;
    connection.query(query, [userId, userId], (err, results) => {
        if (err) return cb(err);
        const { total_income, total_expenses } = results[0];
        const net_income = total_income - total_expenses;
        cb(null, { total_income, total_expenses, net_income });
    });
}


fetch('http://localhost:3000/api/Expenses', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expense)
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit Expense');
        }
        return response.json();
    })
    .then(data => {
        console.log('Expense added:', data);
        updateDashboard();
    })
    .catch(error => {
        console.log('Error:', error);
        alert('Failed to add Expense. please try again');
    });

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' });

app.post('/api/Expenses', authenticateToken, (req, res) => {
    const expense = req.body;
    res.status(201).json({ message: 'Expense added successfully' });
});

app.post('/api/Expenses', authenticateToken, (req, res) => {
    const expense = req.body;
    const query = 'INSERT INTO Expenses SET ?';
    connection.query(query, expense, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to add expense' });
        res.status(201).json({
            message: 'Expense added successfully',
            expenseId: results.insertId, // Returning the ID of the newly inserted record
        });
    });
});

app.delete('/api/Expenses/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;
    res.status(200).json({ message: 'Expense deleted Successfully; ' });
});

app.get('/api/Expenses', authenticateToken, (req, res) => {
    const userId = req.user.id;
    res.status(200).json(expenses);
});

if (response.status === 403 || response.status === 401) {
    alert('Session expired. Please try again.');
    window.location.href = '/login.html';
}

app.get('/api/financial-summary', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const netIncomeQuery = `
        SELECT 
            (SELECT SUM(amount) FROM Income WHERE user_id = ?) AS total_income,
            (SELECT SUM(amount) FROM Expenses WHERE user_id = ?) AS total_expenses,
            ((SELECT SUM(amount) FROM Income WHERE user_id = ?) - (SELECT SUM(amount) FROM Expenses WHERE user_id = ?)) AS net_income;
    `;
    connection.query(netIncomeQuery, [userId, userId, userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results[0]);
    });
});

app.get('/api/expenses/category-breakdown', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT category, SUM(amount) AS total_amount
    FROM Expenses
    WHERE user_id = ?
    GROUP BY category;
    `;
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
});

app.get('/api/budget/progress', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT B.montly_budget, SUM(E.amount) AS total_expenses
    FROM Budget B
    LEFT JOIN Expenses E ON B.user_id = E.user_id
    WHERE B.user_id = ?;
    `;
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json({
            montly_budget: results[0].montly_budget,
            total_expenses: results[0].total_expenses
        });
    });
});

app.get('/api/expenses/trends', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT DATE(expense_date) AS date, SUM(amount) AS daily_total
    FROM Expenses
    WHERE user_id = ?
    GROUP BY DATE(expense_date)
    ORDER BY DATE ASC;
    `;
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
    });
});

app.get('/api/notifications', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT B.montly_budget, SUM(E.amount) AS total_expenses
    FROM Budget B
    LEFT JOIN Expenses E ON B.user_id = E.user_id
    WHERE B.user_id = ?;
    `;
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        const { montly_budget, total_expenses } = results[0];
        let notifications = [];

        if (total_expenses > montly_budget) {
            notifications.push('You have exceeded your Monthly budget!');
        }
        else {
            notifications.push('You are on track with your budget.');
        }
        res.json({ notifications });

    });
});

app.get('/api/expenses/upcoming', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT * FROM Expenses
    WHERE user_id = ? AND expense_date >= CURDATE()
    ORDER BY expense_date ASC;
    `;
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
    });
});

app.get('/api/net-income', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT 
            (SELECT SUM(amount) FROM Income WHERE user_id = ?) AS total_income,
            (SELECT SUM(amount) FROM Expenses WHERE user_id = ?) AS total_expenses,
            ((SELECT SUM(amount) FROM Income WHERE user_id = ?) - (SELECT SUM(amount) FROM Expenses WHERE user_id = ?)) AS net_income;
    `;
    connection.query(query, [userId, userId, userId, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results[0]);

    });
});

fetch('/api/net-income')
    .then(response => response.json())
    .then(data => {
        document.getElementById('net-income').textContent = `$${data.net_income}`;
    });


document.getElementById('successMessage').style.display = 'block';

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
const [error, setError] = useState(null);

const ExpenseBreakdown = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchCategoryBreakdown = async () => {
            try {
                const response = await axios.get('/api/expenses/category-breakdown');
                const categories = response.data.map(item => item.category);
                const amounts = response.data.map(item => item.total_amount);

                setChartData({
                    labels: categories,
                    datasets: [{
                        label: 'Expense Breakdown',
                        data: amounts,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }]
                });
            } catch (err) {
                setError('Failed to load category breakdown');
            }
        };

        fetchCategoryBreakdown();
    }, []);

    {error ? <p>{error.message || error.toString()}</p> : <Pie data={chartData} />}

};


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BudgetProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        axios.get('/api/budget/progress')
            .then(response => {
                const { montly_budget, total_expenses } = response.data;
                const percentage = (total_expenses / montly_budget) * 100;
                setProgress(percentage);
            });
    },
        []);
    return (
        <div>
            <label>BudgetProgress: {progress.toFixed(2)}%</label>
            <progress value={progress} max="100"></progress>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const ExpenseTrends = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        axios.get('/api/expenses/trends')
            .then(response => {
                const dates = response.data.map(item => item.date);
                const totals = response.data.map(item => item.daily_total);
                setChartData({
                    labels: dates,
                    datasets: [{
                        label: 'Daily Expenses',
                        data: totals,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    }]
                });
            });
    }, []);

    return <Line data={chartData} />;
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get('/api/notifications')
            .then(response => {
                setNotifications(response.data.notifications);
            });
    }, []);

    return (
        <div>
            <h3>Notifications</h3>
            <ul>
                {notifications.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingExpenses = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get('/api/expenses/upcoming')
            .then(response => {
                setExpenses(response.data);
            });
    }, []);

    return (
        <div>
            <h3>Upcoming Expenses</h3>
            <ul>
                {expenses.map((expense, index) => (
                    <li key={index}>{expense.name} - {expense.amount} due on {expense.expense_date}</li>
                ))}
            </ul>
        </div>
    );
};

import ExpenseBreakdown from './ExpenseBreakdown';
import BudgetProgress from './BudgetProgress';
import ExpenseTrends from './ExpenseTrends';
import Notifications from './Notifications';
import UpcomingExpenses from './UpcomingExpenses';
import React from 'react';

const Dashboard = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        axios.get('/api/financial-summary')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <ExpenseBreakdown data={data.expensesBreakdown} />
            <BudgetProgress progress={data.budgetProgress} />
            <ExpenseTrends trends={data.expenseTrends} />
            <Notifications notifications={data.notifications} />
            <UpcomingExpenses expenses={data.upcomingExpenses} />
        </div>
    );
};


export default {
    ExpenseBreakdown,
    BudgetProgress,
    ExpenseTrends,
    Notifications,
    UpcomingExpenses,
    Dashboard
};

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.add('visible');
    errorMessage.textContent = message;
    setTimeout(() => errorMessage.classList.remove('visible'), 5000); // Hide after 5 seconds
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: { beginAtZero: true }
    }
};

return <Pie data={chartData} options={options} />;
