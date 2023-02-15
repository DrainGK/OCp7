const Book = require("../models/book.model");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const imageURL = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  const book = new Book({
    userId: req.auth.userId,
    ...bookObj,
    imageURL,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Le livre a bien été créé" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((book1, book2) => book2.averageRating - book1.averageRating);
      res.status(200).json(books.slice(0, 3));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const book = new Book({
    _id: req.params.id,
    userId: req.body.userId,
    title: req.body.book.title,
    author: req.body.book.author,
    imageUrl: req.body.book.imageUrl,
    year: req.body.book.year,
    genre: req.body.book.genre,
    ratings: req.body.book.ratings,
    averageRating: req.body.book.averageRating,
  });
  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(201).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.addRating = (req, res, next) => {
  const newRating = req.body;
  if (newRating.userId != req.auth.userId) {
    res.status(401).json({ message: "Not authorized" });
  }
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.ratings.find((rating) => rating.userId === newRating.userId)) {
        res.status(400).json({ error: "Vous avez déjà noté ce livre" });
      } else {
        const newBook = book;
        newBook.ratings.push({
          userId: newRating.userId,
          grade: newRating.rating,
          _id: newRating._id,
        });
        newBook.averageRating = calcAverageRating(book.ratings);

        Book.updateOne(
          { _id: req.params.id },
          { ratings: newBook.ratings, averageRating: newBook.averageRating }
        )
          .then(() => res.status(201).json(newBook))
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

/**
 * Fonction pour calculer la note moyenne d'un livre
 * @param {[{grade:Number}]} array
 */
function calcAverageRating(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += Number(array[i].grade);
  }

  return parseFloat(total / array.length).toFixed(2);
}
