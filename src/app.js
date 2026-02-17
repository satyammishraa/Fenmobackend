require("dotenv").config();   

const express = require("express");
const connectDB = require("./config/db");   
const expenseRouter = require("./routes/expenseRoutes");

const app = express();

connectDB();   

app.use(express.json());

app.use("/expenses", expenseRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
