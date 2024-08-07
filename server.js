const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')

const app = express();
const port = 3000;

// Configura o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura a conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_rental'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Rota para registrar um usuário
app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        connection.query(sql, [name, email, hashedPassword], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, name, email });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para fazer login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const user = results[0];

            // Verifica a senha
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: err.message });
                if (isMatch) {
                    res.status(200).json(user);
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running on http://10.0.2.2:${port}`);
});
