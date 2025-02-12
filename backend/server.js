
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;
const SECRET = "supersecretkey";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "auth_db",
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});




// Middleware de autenticação
function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do cabeçalho

  if (!token) {
    return res.status(401).send('Token não fornecido');
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido');
    }
    req.user = decoded; // Armazena o usuário decodificado na requisição
    next(); // Continua a execução da rota
  });
}




const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  jwt.verify(token, "supersecretkey", (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = decoded; // Adiciona os dados do usuário decodificados no request
    next(); // Chama o próximo middleware ou a função da rota
  });
};

app.get("/tokenappliances", verifyToken, (req, res) => {
  const userId = req.user.id; // Acessa o ID do usuário do token
  // Busca os eletrodomésticos do usuário logado
  db.query("SELECT * FROM appliances WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).send("Error fetching appliances");
    res.json(results); // Retorna os dados para o frontend
  });
});

// Rota de Registro
app.post("/register", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
  db.query(query, [email, username, hashedPassword], (err, result) => {
    if (err) return res.status(500).send("Error creating user");
    res.status(201).json({ message: "User registered" });
  });
});

// Rota de Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(404).send("User not found");
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid credentials");
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

// Rota protegida para obter eletrodomésticos
app.get("/appliances", authenticate, (req, res) => {
  const userId = req.user.id;
  const query = "SELECT * FROM appliances WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send('Erro ao obter eletrodomésticos');
    res.json(results);
  });
});

// Rota para adicionar um eletrodoméstico
app.post("/appliances", authenticate, (req, res) => {
  const { name, power, hours_per_day, days_per_month } = req.body;
  const userId = req.user.id;
  const query = "INSERT INTO appliances (user_id, name, power, hours_per_day, days_per_month) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [userId, name, power, hours_per_day, days_per_month], (err, result) => {
    if (err) return res.status(500).send("Error adding appliance");
    res.status(201).send("Appliance added");
  });
});

// Rota para editar um eletrodoméstico
app.put("/appliances/:id", authenticate, (req, res) => {
  const applianceId = req.params.id;
  const { name, power, hours_per_day, days_per_month } = req.body;
  const userId = req.user.id;

  // Verifica se o aparelho pertence ao usuário
  const query = "SELECT * FROM appliances WHERE id = ? AND user_id = ?";
  db.query(query, [applianceId, userId], (err, results) => {
    if (err) return res.status(500).send('Erro ao verificar o aparelho');
    if (results.length === 0) {
      return res.status(404).send('Eletrodoméstico não encontrado ou você não tem permissão para editar');
    }

    // Atualiza as informações do aparelho
    const updateQuery = "UPDATE appliances SET name = ?, power = ?, hours_per_day = ?, days_per_month = ? WHERE id = ?";
    db.query(updateQuery, [name, power, hours_per_day, days_per_month, applianceId], (err, result) => {
      if (err) return res.status(500).send('Erro ao atualizar o aparelho');
      res.status(200).send('Eletrodoméstico atualizado com sucesso');
    });
  });
});

app.delete("/appliances/:id", authenticate, (req, res) => {
  const applianceId = req.params.id;
  const userId = req.user.id;

  // Verifica se o aparelho existe e pertence ao usuário
  const query = "SELECT * FROM appliances WHERE id = ? AND user_id = ?";
  db.query(query, [applianceId, userId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar o aparelho:', err);
      return res.status(500).send('Erro ao verificar o aparelho');
    }
    if (results.length === 0) {
      return res.status(404).send('Eletrodoméstico não encontrado ou você não tem permissão para excluir');
    }

    // Deleta o aparelho
    const deleteQuery = "DELETE FROM appliances WHERE id = ?";
    db.query(deleteQuery, [applianceId], (err, result) => {
      if (err) {
        console.error('Erro ao excluir o aparelho:', err);
        return res.status(500).send('Erro ao excluir o aparelho');
      }
      
      res.status(200).send('Eletrodoméstico excluído com sucesso');
    });
  });
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
