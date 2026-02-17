const { v4: uuidv4 } = require("uuid");
const { readExpenses, writeExpenses } = require("../models/expenseModel");

exports.createExpense = (req, res) => {
    const { amount, category, description, date } = req.body;

    if (!amount || amount < 0 || !category || !date) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const expenses = readExpenses();

    // Idempotency check (based on same fields)
    const existing = expenses.find(
        e =>
            e.amount === amount &&
            e.category === category &&
            e.description === description &&
            e.date === date
    );

    if (existing) {
        return res.status(200).json(existing);
    }

    const newExpense = {
        id: uuidv4(),
        amount: Number(amount),
        category,
        description,
        date,
        created_at: new Date().toISOString()
    };

    expenses.push(newExpense);
    writeExpenses(expenses);

    res.status(201).json(newExpense);
};

exports.getExpenses = (req, res) => {
    let expenses = readExpenses();
    const { category, sort } = req.query;

    if (category) {
        expenses = expenses.filter(e => e.category === category);
    }

    if (sort === "date_desc") {
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
        total,
        count: expenses.length,
        data: expenses
    });
};
