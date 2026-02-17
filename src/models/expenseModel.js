const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../data/expenses.json");

function readExpenses() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function writeExpenses(expenses) {
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
}

module.exports = { readExpenses, writeExpenses };
