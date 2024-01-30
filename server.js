const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
require("colors");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const connectDB = require("./config/connectDB");

const { NODE_ENV, PORT, BASE_URL } = process.env;

const mountRoutes = require("./routes");

// Connect To DB
connectDB();

// Init App
const app = express();
app.use(express.static(path.join(__dirname, "/uploads")));

// Middlewares
app.use(express.json());
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(
    `Server is running
- MODE:`.magenta,
    `${NODE_ENV} ✓`.white
  );
} else {
  console.log(
    `Server is running
- MODE:`.magenta,
    `${NODE_ENV} ✓`.white
  );
}

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware For Express
app.use(globalError);

// Run Server
const server = app.listen(PORT, () =>
  console.log(
    `${"- PORT".magenta}: ${PORT.white} ✓
${"- BASEURL".magenta}: ${BASE_URL.white} ✓`
  )
);

// Handle "Unhandled Rejection Errors" Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors --> ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
