const express = require("express"); // Added Express framework
const cors = require("cors"); // Added CORS to allow Angular connections
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express(); // Initialize express app
app.use(cors()); // Enable CORS policy 
app.use(express.json()); // Allow the server to parse JSON bodies

// Multer Config for file uploads
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guarda directamente en los assets del frontend
    cb(null, path.join(__dirname, '../the-comic-vault-spa/src/assets'));
  },
  filename: (req, file, cb) => {
    // Generamos un nombre único (timestamp) para que no se sobre-escriban imágenes
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });*/

const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save directly to the local 'uploads' folder on the server
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Generate a unique name using a timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve the folder as static so Angular can access the images via URL
app.use('/uploads', express.static(uploadDir));

// COMICS TABLE

// Endpoints ---

// Upload an image
app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image provided" });
        }
        res.json({ success: true, filename: req.file.filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all comics from the database
app.get("/api/comics", async (req, res) => {
    try {
        const comics = await getProducts();
        res.json(comics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get featured comics (first 6) for the home page
app.get("/api/comics/featured", async (req, res) => {
    try {
        const comics = await getFeaturedProducts();
        res.json(comics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single comic by its ID
app.get("/api/comics/:id", async (req, res) => {
    try {
        const comic = await getProductById(req.params.id);
        if (comic.length === 0) return res.status(404).json({ message: "Comic not found" });
        res.json(comic[0]); // Returns the first result
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new comic
app.post("/api/comics", async (req, res) => {
    try {
        const result = await createProduct(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing comic
app.put("/api/comics/:id", async (req, res) => {
    try {
        await updateProduct(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a comic
app.delete("/api/comics/:id", async (req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new contact message
app.post("/api/messages", async (req, res) => {
    try {
        const result = await createMessage(req.body);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Database functions ---

async function getProducts() {
  const query = "SELECT * FROM comics";
  const [comics] = await db.query(query);
  return comics;
}

// To support getFeaturedComics()
async function getFeaturedProducts() {
  const query = "SELECT * FROM comics LIMIT 6";
  const [comics] = await db.query(query);
  return comics;
}

//------------------------
async function getProductById(id) {
  //maybe deleting this later...
  const query = "SELECT * FROM comics WHERE id = ?";
  const [comic] = await db.query(query, [id]);
  return comic;
}
//-----------------------------

async function createProduct(product) {
  // Added all columns found in your Angular model
  const query =
    `INSERT INTO comics 
    (title, category, brand, writer, artist, price, stock, image_url, description, is_available, release_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.query(query, [
    product.title,
    product.category,
    product.brand,
    product.writer,
    product.artist,
    product.price,
    product.stock,
    product.image_url,
    product.description,
    product.is_available,
    product.release_date
  ]);
  return result;
}

async function updateProduct(id, product) {
  // Updated to include all relevant fields for a comic update
  const query =
    `UPDATE comics SET 
    title = ?, category = ?, brand = ?, writer = ?, artist = ?, 
    price = ?, stock = ?, image_url = ?, description = ?, 
    is_available = ?, release_date = ? 
    WHERE id = ?`;
  const [result] = await db.query(query, [
    product.title,
    product.category,
    product.brand,
    product.writer,
    product.artist,
    product.price,
    product.stock,
    product.image_url,
    product.description,
    product.is_available,
    product.release_date,
    id,
  ]);
  return result;
}

async function deleteProduct(id) {
  const query = "DELETE FROM comics WHERE id = ?";
  const [result] = await db.query(query, [id]);
  return result;
}

// MESSAGES TABLE

async function createMessage(message) {
  const insertQuery = "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
  const [result] = await db.query(insertQuery, [
    message.name,
    message.email,
    message.subject,
    message.message
  ]);
  return result;
}

// Port configuration for Render 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en puerto ${PORT}`);
});