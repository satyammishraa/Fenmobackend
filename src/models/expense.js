const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    amount: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    idempotencyKey: {
        type: String,
        unique: true
    }
}, { timestamps: { createdAt: "created_at" } });

module.exports = mongoose.model("Expense", expenseSchema);
