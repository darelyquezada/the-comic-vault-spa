const db = require("./db");
// Punto de entrada principal del servidor

async function getProducts() {
  const query = "SELECT * FROM comics";
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
  const query =
    "INSERT INTO comics (name, price, description) VALUES (?, ?, ?)";
  const [result] = await db.query(query, [
    product.name,
    product.price,
    product.description,
  ]);
  return result;
}

async function updateProduct(id, product) {
  const query =
    "UPDATE comics SET name = ?, price = ?, description = ? WHERE id = ?";
  const [result] = await db.query(query, [
    product.name,
    product.price,
    product.description,
    id,
  ]);
  return result;
}

async function deleteProduct(id) {
  const query = "DELETE FROM comics WHERE id = ?";
  const [result] = await db.query(query, [id]);
  return result;
}
//----------------Table messages

async function createMessage(message) {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(50) NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        subject VARCHAR(50) NOT NULL,
        message TEXT NOT NULL
    )`;
  await db.query(createTableQuery);

  const insertQuery =
    "INSERT INTO messages (name, email, message, subject) VALUES (?, ?, ?, ?)";
  const [result] = await db.query(insertQuery, [
    message.name,
    message.email,
    message.subject,
    message.message,
  ]);
  return result;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en puerto ${PORT}`);
});
