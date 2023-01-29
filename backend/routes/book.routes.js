const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book.controller");

router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", bookCtrl.deleteBook);
router.get("/", bookCtrl.getAllBook);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
