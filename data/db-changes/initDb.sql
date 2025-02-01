-- Tabella Viaggi
CREATE TABLE Viaggi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destinazione VARCHAR(255) NOT NULL,
    dataPartenza DATE NOT NULL,
    dataRitorno DATE NOT NULL
);

-- Tabella Guide
CREATE TABLE Guide (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL
);

-- Tabella Viaggiatori
CREATE TABLE Viaggiatori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) UNIQUE NOT NULL
);

-- Tabella di relazione tra Viaggi e Guide (molti-a-molti)
CREATE TABLE Viaggi_Guide (
    viaggio_id INT,
    guida_id INT,
    PRIMARY KEY (viaggio_id, guida_id),
    FOREIGN KEY (viaggio_id) REFERENCES Viaggi(id) ON DELETE CASCADE,
    FOREIGN KEY (guida_id) REFERENCES Guide(id) ON DELETE CASCADE
);

-- Tabella di relazione tra Viaggi e Viaggiatori (molti-a-molti)
CREATE TABLE Viaggi_Viaggiatori (
    viaggio_id INT,
    viaggiatore_id INT,
    PRIMARY KEY (viaggio_id, viaggiatore_id),
    FOREIGN KEY (viaggio_id) REFERENCES Viaggi(id) ON DELETE CASCADE,
    FOREIGN KEY (viaggiatore_id) REFERENCES Viaggiatori(id) ON DELETE CASCADE
);


-- Inserimento Viaggi
INSERT INTO Viaggi (id, destinazione, dataPartenza, dataRitorno) VALUES
(1, 'Roma, Italia', '2023-11-01', '2023-11-07'),
(2, 'Parigi, Francia', '2023-11-10', '2023-11-15'),
(3, 'New York, USA', '2023-12-05', '2023-12-12'),
(4, 'Tokyo, Giappone', '2024-01-15', '2024-01-22'),
(5, 'Londra, Regno Unito', '2024-02-01', '2024-02-08'),
(6, 'Barcellona, Spagna', '2024-03-10', '2024-03-17'),
(7, 'Berlino, Germania', '2024-04-05', '2024-04-12'),
(8, 'Sydney, Australia', '2024-05-01', '2024-05-10'),
(9, 'Rio de Janeiro, Brasile', '2024-06-15', '2024-06-22'),
(10, 'Città del Capo, Sudafrica', '2024-07-01', '2024-07-10');

-- Inserimento Guide
INSERT INTO Guide (nome, cognome) VALUES
('Mario', 'Rossi'), ('Laura', 'Bianchi'), ('Jean', 'Dupont'), ('Sophie', 'Martin'),
('John', 'Smith'), ('Emily', 'Johnson'), ('Yuki', 'Tanaka'), ('Hiroshi', 'Sato'),
('James', 'Brown'), ('Emma', 'Wilson'), ('Carlos', 'Garcia'), ('Ana', 'Lopez'),
('Michael', 'Schmidt'), ('Julia', 'Weber'), ('David', 'Jones'), ('Sarah', 'Brown'),
('Carlos', 'Silva'), ('Ana', 'Costa'), ('John', 'Doe'), ('Jane', 'Smith');

-- Inserimento Viaggiatori
INSERT INTO Viaggiatori (nome, cognome, mail, telefono) VALUES
('Giuseppe', 'Verdi', 'giuseppe.verdi@example.com', '1234567890'),
('Maria', 'Neri', 'maria.neri@example.com', '0987654321'),
('Luca', 'Rossi', 'luca.rossi@example.com', '1122334455'),
('Sara', 'Bianchi', 'sara.bianchi@example.com', '2233445566'),
('Paolo', 'Gialli', 'paolo.gialli@example.com', '3344556677'),
('Laura', 'Verdi', 'laura.verdi@example.com', '4455667788'),
('Marco', 'Neri', 'marco.neri@example.com', '5566778899');

-- Inserimento Viaggi_Guide
INSERT INTO Viaggi_Guide (viaggio_id, guida_id) VALUES
(1, 1), (1, 2), (2, 3), (2, 4),
(3, 5), (3, 6), (4, 7), (4, 8),
(5, 9), (5, 10), (6, 11), (6, 12),
(7, 13), (7, 14), (8, 15), (8, 16),
(9, 17), (9, 18), (10, 19), (10, 20);

ALTER TABLE Viaggiatori
ADD COLUMN slug VARCHAR(255) UNIQUE;

INSERT INTO Viaggiatori (nome, cognome, mail, telefono, slug)
VALUES
('Marco', 'Pellegrini', 'marco.pellegrini@example.com', '1234567890', 'marco-pellegrini'),
('Anna', 'Verdi', 'anna.verdi@example.com', '0987654321', 'anna-verdi'),
('Luca', 'Neri', 'luca.neri@example.com', '1122334455', 'luca-neri');


-- Inserimento Viaggi_Viaggiatori
INSERT INTO Viaggi_Viaggiatori (viaggio_id, viaggiatore_id)
VALUES

(1, 4),  -- Viaggio 1 con Viaggiatore 4
(2, 5),
(2, 6), 
(2, 7),  
(3, 3), 
(3, 7), 
(4, 1), 
(4, 2),  
(4, 3),  
(5, 4),
(5, 5), 
(5, 6), 
(6, 7), 
(6, 4),  
(7, 6),  
(7, 7), 
(8, 1), 
(8, 2),  
(9, 3),  
(9, 4), 
(10, 5),
(10, 6); 


ALTER TABLE Viaggi
ADD COLUMN slug VARCHAR(255) UNIQUE;

UPDATE Viaggi
SET slug = LOWER(CONCAT(REPLACE(destinazione, ' ', '-'), '-', DATE_FORMAT(dataPartenza, '%Y-%m-%d')));

UPDATE `weroad_db`.`viaggi` SET `slug` = 'roma-2023-11-01' WHERE (`id` = '1');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'parigi-2023-11-10' WHERE (`id` = '2');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'new-york-2023-12-05' WHERE (`id` = '3');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'tokyo-2024-01-15' WHERE (`id` = '4');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'londra-2024-02-01' WHERE (`id` = '5');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'barcellona-2024-03-10' WHERE (`id` = '6');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'berlino-2024-04-05' WHERE (`id` = '7');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'sydney-2024-05-01' WHERE (`id` = '8');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'rio-2024-06-15' WHERE (`id` = '9');
UPDATE `weroad_db`.`viaggi` SET `slug` = 'citta-del-capo-2024-07-01' WHERE (`id` = '10');
