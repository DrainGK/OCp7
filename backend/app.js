const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bookRouter = require("./routes/books");
const userRouter = require("./routes/users");
const cors = require("cors");
const path = require("path");

mongoose.connect(
    "mongodb+srv://GuyLebon:Test1234@cluster0.wop2fvj.mongodb.net/grimoire",
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(
    () => console.log("Connexion à MongoDB réussie !")
).catch(
    () => console.log("Connexion à MongoDB échouée !")
);

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    });

    next();
});

app.use("/api/auth", userRouter);

app.use("/api/books", bookRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
