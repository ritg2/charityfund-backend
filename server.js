const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDb();

app.use(express.json());
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/campaign", require("./routes/campaignRoutes"));
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
