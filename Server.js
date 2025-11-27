const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Read JSON files
const categoriesPath = path.join(__dirname, "category.json");
const itemsPath = path.join(__dirname, "items.json");

let categories = [];
let items = [];

try {
  categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
  items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));
} catch (err) {
  console.error("Error reading JSON files:", err);
}

// GET all categories
app.get("/api/category", (req, res) => {
  res.json({ success: true, });
});

// GET items by category id or name
app.get("/api/category/:identifier", (req, res) => {
  const { identifier } = req.params;

  // Find category first
  const category = categories.find(
    c => c.id === Number(identifier) || c.name.toLowerCase() === identifier.toLowerCase()
  );

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  // Find items for that category
  const categoryItems = items.find(it => it.categoryId === category.id);

  res.json({
    success: true,
    category: category.name,
    items: categoryItems ? categoryItems.items : []
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
