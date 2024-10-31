require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSON = require("./docs/swagger.json");
const cors = require("cors");

const app = express();
const PORT = 3000;

const userRoutes = require("./routes/userRoutes");
const bankAccountRoutes = require("./routes/bankAccountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);
app.use("/api/v1", bankAccountRoutes);
app.use("/api/v1", transactionRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSON));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
