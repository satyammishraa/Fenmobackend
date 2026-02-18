require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRouter = require("./routes/expenseRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// ✅ CORS Configuration (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // local frontend
      "https://fenmofrontendd.vercel.app"      // deployed frontend
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/expenses", expenseRouter);

// Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
