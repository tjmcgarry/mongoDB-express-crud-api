//  ###https://github.com/iamshaunjp/complete-mongodb###

const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

// init app & middleware
const app = express();
// read json from reqs
app.use(express.json());

// connect to db
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

app.get("/books", (req, res) => {
  // const page = req.query.p || 0;
  // const booksPerPage = 2;

  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    // .skip(page * booksPerPage)
    // .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ message: "Could not fetch the documents" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ message: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ message: "Not a valid document id" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ message: "Not a valid document id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { updates } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ message: "Not a valid document id" });
  }
});
