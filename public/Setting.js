document.addEventListener('DOMContentLoaded', function () {
    loadSettings();

    document.getElementById('settingform').addEventListener('submit', function (e) {
        e.preventDefault();

        const currency = document.getElementById('currency').value;
        const notifyBudgetExceed = document.getElementById('notifybudgetexceed').checked;
        const notifyExpenseOverX = document.getElementById('notifyexpenselimit').checked;
        const expenseLimit = notifyExpenseOverX ? parseFloat(document.getElementById('expenseslimit').value) : null;

        const settingsData = {
            currencyurrency: currency,
            notifybudgetexceed: notifyBudgetExceed,
            notify_expense_over_x: notifyExpenseOverX,
            ExpenseLimit: expenseLimit
        };
        saveSetting(settingsData);

    });

    document.getElementById('notifyexpenselimit').addEventListener('change', function () {
        const expenseLimitSection = document.getElementById('expenselimit');

        if (this.checked) {
            expenseLimitSection.style.display = 'block';
        }
        else {
            expenseLimitSection.style.display = 'none';
        }
    });

});

function loadSettings() {
    fetch('/api/user/settings')
        .then(response => response.json())
        .then(data => {
            document.getElementById('currency').value = data.currency;
            document.getElementById('notifybudgetexceed').checked = data.notifyBudgetExceed;
            document.getElementById('notifyexpenselimit').checked = data.notifyExpenseOverX;
            if (data.notifyExpenseOverX) {
                document.getElementById('expenselimit').style.display = 'block';
                document.getElementById('expenseslimit').value = data.ExpenseLimit;
            }
        })
        .catch(error => {
            console.error('Error loading user settings:', error);
        });
}

function saveSetting(settingsData) {
    fetch('/api/user/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
    })
        .then(response => {
            if (response.ok) {
                alert('Settings Saved Successfully');
            }
            else {
                alert('Failed to save Settings');
            }
        })
        .catch(error => {
            console.error('Error Saving Settings', error);
            alert('An error occurred while saving settings');
        });
}

app.get('/api/user/settings', (req, res) => {
    const userId = req.user.id;

    const sql = `SELECT * FROM Settings WHERE user_id = ?`;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch settings' });
        }
        res.json(result[0]);
    });
});

app.post('/api/user/settings', (req, res) => {
    const userId = req.user.id;
    const { currency, notifybudgetexceed, notify_expense_over_x, expenseLimit } = req.body;

    const sql = `INSERT INTO Settings (user_id, currency, notifyBudgetExceed, notifyExpenseOverX, expenseLimit)
    VALUES(?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
    currency = VALUES(currency),
        notifybudgetexceed = VALUES(notifybudgetexceed),
        notify_expense_over_x = VALUES(notify_expense_over_x),
        expenseLimit = VALUES(expenseLimit)`;

    db.query(sql, [userId, currency, notifybudgetexceed, notify_expense_over_x, expenseLimit], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save settings' });
        }
        res.json({ message: 'Settings updated successfully' });
    });
});
