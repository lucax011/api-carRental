-- Esquema mínimo usado pela API (MySQL 8)
CREATE DATABASE IF NOT EXISTS car_rental;
USE car_rental;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  model VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  plate VARCHAR(10) NOT NULL UNIQUE,
  year INT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6)
);

CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  duration INT,
  distance DECIMAL(10,2),
  totalPrice DECIMAL(10,2),
  startDate DATETIME,
  final_date DATETIME,
  FOREIGN KEY (car_id) REFERENCES cars(id)
);
