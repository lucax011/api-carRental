# API Car Rental

API REST do **Urban Drive**, um app de aluguel de carros por hora ou por dia. Ela lista os carros disponíveis com localização, autentica usuários e consulta os dados de um aluguel.

Apps que consomem esta API:
- [urbandrive_dart](https://github.com/lucax011/urbandrive_dart): app em Flutter
- [UrbanDrive](https://github.com/lucax011/UrbanDrive): app em Kotlin (Android nativo)

## Stack

- Node.js + Express
- MySQL (`mysql2`)
- Senhas com hash `bcrypt`

## Como rodar

Pré-requisitos: Node.js 18+ e MySQL 8.

```bash
npm install
mysql -u root < schema.sql
npm start                 # porta 3000
```

A conexão usa `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `PORT`, com padrão `localhost`, `root`, sem senha, `car_rental` e `3000`. No emulador Android a API fica em `http://10.0.2.2:3000`.

## Endpoints

| Método | Rota | Corpo | Descrição |
| --- | --- | --- | --- |
| GET | `/api/cars` | — | Lista os carros com marca, modelo, placa e coordenadas |
| POST | `/api/users/register` | `{ name, email, password }` | Cria o usuário; `409` se o e-mail já existir |
| POST | `/api/users/login` | `{ email, password }` | Retorna o usuário sem a senha; `401` se inválido |
| POST | `/api/rentals/details` | `{ carId }` | Duração, distância, preço e datas do aluguel |
