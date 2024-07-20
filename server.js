const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();

connectDb();

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "example.com"],
    },
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URI,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/campaign", require("./routes/campaignRoutes"));
app.use("/api/v1/comment", require("./routes/commentRoutes"));
app.use("/api/v1/donation", require("./routes/donationRoutes"));
app.use("/api/v1/webhook", require("./routes/webhookRoutes"))
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
