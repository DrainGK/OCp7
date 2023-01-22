const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/auth", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

//routes

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// Server
app.listen(process.env.PORT, () => {
  console.log(`listening on port${process.env.PORT}`);
});
