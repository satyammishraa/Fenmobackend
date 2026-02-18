const Expense = require("../models/expense");
const { v4: uuidv4 } = require("uuid");

exports.createExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;

        if (!amount || amount < 0 || !category || !date) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const idempotencyKey =
            req.header("Idempotency-Key") || uuidv4();

        const existing = await Expense.findOne({ idempotencyKey });

        if (existing) {
            return res.status(200).json(existing);
        }

        const expense = await Expense.create({
            amount,
            category,
            description,
            date,
            idempotencyKey
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error creating expense" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { category, sort } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        let expensesQuery = Expense.find(query);

        if (sort === "date_desc") {
            expensesQuery = expensesQuery.sort({ date: -1 });
        }

        const expenses = await expensesQuery;

        const total = expenses.reduce(
            (sum, e) => sum + parseFloat(e.amount.toString()),
            0
        );

        res.json({
            total,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses" });
    }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting expense" });
  }
};

