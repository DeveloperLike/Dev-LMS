require('dotenv').config();

const express = require("express");
const cors = require("cors");

const { getSqlConnection } = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");
const transaction = require("./routes/transactionRoutes");


async function startServer() {
  await getSqlConnection();
}

startServer();

// -------------------
// Easebuzz Payment
// -------------------

app.use("/api", paymentRoutes);

// -------------------
// Send Email API
// -------------------

app.use("/api", emailRoutes);

// -------------------
// Transaction API
// -------------------

app.use("/api", transaction);

// -------------------
// Server
// -------------------

app.listen(3001, () => {
  console.log("Easebuzz server running on port 3001");
});
