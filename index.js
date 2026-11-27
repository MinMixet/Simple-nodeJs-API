import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
//Cambio
//En db.json presionar shift + alt + f, si es que el json perdio el formato

/*Will be implemented for solving case "readData() fails"

*/

const app = express();

app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (err) {
    console.log("Error:", err);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my first api with NodeJs");
});

app.get("/books", (req, res) => {
  let data;
  try {
    data = readData();
  } catch (err) {
    console.error("Error reading the book", err);
    return res.status(500).json({ error: "Could not load database" });
  }
  res.json(data.books);
});

app.get("/books/:id", (req, res) => {
  let data;
  try {
    data = readData();
  } catch (err) {
    console.error("Error reading the book", err);
    return res.status(500).json({ error: "Could not load database" });
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid book ID" });
  }
  const book = data.books.find((book) => book.id === id);
  console.log(book);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

//Solved counter id problem
app.post("/books", (req, res) => {
  let data;
  try {
    data = readData();
  } catch (err) {
    console.error("Error reading the book", err);
    return res.status(500).json({ error: "Could not load database" });
  }
  const body = req.body;
  const IdMax = Math.max(0, ...data.books.map((book) => book.id));
  const newBook = {
    id: IdMax + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

//Solved not found bookIndex problem
app.put("/books/:id", (req, res) => {
  let data;
  try {
    data = readData();
  } catch (err) {
    console.error("Error reading the book", err);
    return res.status(500).json({ error: "Could not load database" });
  }
  const body = req.body;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid book ID" });
  }
  const bookIndex = data.books.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

//Solved not found bookIndex problem
app.delete("/books/:id", (req, res) => {
  let data;
  try {
    data = readData();
  } catch (err) {
    console.error("Error reading the book", err);
    return res.status(500).json({ error: "Could not load database" });
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid book ID" });
  }
  const bookIndex = data.books.findIndex((book) => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  data.books.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
