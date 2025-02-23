const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Item = require("./item-model");
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/node-crud-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3001", // Only allow requests from this origin
  })
); // This will enable CORS for all routes
app.use(bodyParser.json());

// Start the server
const PORT = process.env.PORT || 3000;

// Create an item
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).send(savedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read an item by id
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an item by id
app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(updatedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete an item by id
app.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    res.status(200).send(deletedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
