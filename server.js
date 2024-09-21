const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Connected to the database!');

    // Definindo a rota APÓS a conexão ser estabelecida
    app.get('/api/cars', (req, res) => {
        let sql = 'SELECT * FROM cars';
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Erro ao buscar carros:', err);
                res.status(500).send({ error: 'Erro ao buscar carros' });
            } else {
                res.json(result); // Retorna os carros como JSON
            }
        });
    });

    // Rota para fazer login
    app.post('/api/users/login', (req, res) => {
        const { email, password } = req.body;

        const sql = 'SELECT * FROM users WHERE email = ?';
        connection.query(sql, [email], (err, results) => {
            if (err) return res.status(500).json({ error: 'Erro no servidor' });

            if (results.length > 0) {
                const user = results[0];

                // Verifica a senha
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return res.status(500).json({ error: 'Erro ao verificar a senha' });
                    if (isMatch) {
                        // Remove a senha antes de enviar a resposta
                        const { password, ...userWithoutPassword } = user;
                        res.status(200).json(userWithoutPassword); // Retorna os dados do usuário sem a senha
                    } else {
                        res.status(401).json({ message: 'Credenciais inválidas' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Credenciais inválidas' });
            }
        });
    });

// Rota para buscar informações de um aluguel utilizando req.body
app.post('/api/rentals/details', (req, res) => {
    const { carId } = req.body;  // Obtém o carId do corpo da requisição

    const query = 'SELECT * FROM rentals WHERE car_id = ?';

    connection.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Erro ao buscar detalhes do aluguel:', err);
            res.status(500).json({ error: 'Erro ao buscar detalhes do aluguel' });
        } else if (result.length > 0) {
            const rental = result[0];
            const rentalMap = {
                car_id: rental.car_id,
                duration: rental.duration,
                distance: rental.distance,
                totalPrice: rental.totalPrice,
                startDate: rental.startDate,
                final_date: rental.final_date
            };
            res.json(rentalMap);
        } else {
            res.status(404).json({ message: 'Aluguel não encontrado' });
        }
    });
});


    
    

    // Rota para registrar um usuário
    app.post('/api/users/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            // Verifica se o e-mail já está registrado
            const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
            connection.query(checkEmailSql, [email], async (err, results) => {
                if (err) return res.status(500).json({ error: 'Erro no servidor' });

                if (results.length > 0) {
                    // E-mail já registrado
                    return res.status(409).json({ message: 'E-mail já registrado' });
                } else {
                    // Criptografa a senha
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Insere o novo usuário
                    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
                    connection.query(sql, [name, email, hashedPassword], (err, results) => {
                        if (err) return res.status(500).json({ error: 'Erro ao registrar o usuário' });
                        res.status(201).json({ id: results.insertId, name, email });
                    });
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao registrar o usuário' });
        }
    });

    // Inicia o servidor após garantir que a conexão está estabelecida
    app.listen(port, () => {
        console.log(`Servidor rodando em http://10.0.2.2:${port}`);
    });
});
