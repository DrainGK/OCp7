const express = require("express");
const bodyParser = require("body-parser"); // We need bodyParser to extract the information from HTTP requests and render it usable
const mongoose = require("mongoose"); // We'll need the mongoose plugin to connect to the DB
const path = require("path"); // We'll use the path plugin to upload our images

const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");

mongoose
  .connect(
    "mongodb+srv://GuyLebon:Test1234@cluster0.wop2fvj.mongodb.net/grimoire",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

const app = express();

app.use((req, res, next) => {
  // We declare all the headers to allow :
  res.setHeader("Access-Control-Allow-Origin", "*"); // Connection from any origin
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Access to any of these routes
  next();
});

app.use(bodyParser.json()); // This will parse application/json type POST data

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app; // Our server.js will use all the code in here to make the backend run
