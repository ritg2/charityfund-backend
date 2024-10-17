const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

connectDb();

app.set("trust proxy", ["52.31.139.75", "52.49.173.169", "52.214.14.220"]);

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
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URI,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// Generated by Chatgpt
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_STRING,
    }),
    secret: process.env.SESSION_SECRET, // Change this to a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // Adjust based on cross-site request needs
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration (1 day)
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/organization", require("./routes/organizationRoutes"));
app.use("/api/v1/campaign", require("./routes/campaignRoutes"));
app.use("/api/v1/comment", require("./routes/commentRoutes"));
app.use("/api/v1/donation", require("./routes/donationRoutes"));
app.use("/api/v1/webhook", require("./routes/webhookRoutes"));
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
