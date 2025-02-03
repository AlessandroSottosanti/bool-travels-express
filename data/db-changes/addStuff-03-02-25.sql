ALTER TABLE Viaggiatori ADD COLUMN codiceFiscale VARCHAR(16) UNIQUE;

ALTER TABLE Viaggi ADD COLUMN inCorso BOOLEAN DEFAULT FALSE;


-- Inserimento Viaggiatori aggiornato con codice fiscale

UPDATE Viaggiatori SET codiceFiscale = 'VRDGPP80A01H501Z' WHERE id = 1;
UPDATE Viaggiatori SET codiceFiscale = 'NRIMRA85B02F205Y' WHERE id = 2;
UPDATE Viaggiatori SET codiceFiscale = 'RSSLCU90C03H501T' WHERE id = 3;
UPDATE Viaggiatori SET codiceFiscale = 'BNCSRA95D04H501L' WHERE id = 4;
UPDATE Viaggiatori SET codiceFiscale = 'GLIPAO70E05H501M' WHERE id = 5;
UPDATE Viaggiatori SET codiceFiscale = 'VRDLRA75F06H501P' WHERE id = 6;
UPDATE Viaggiatori SET codiceFiscale = 'NRIMRC88G07H501S' WHERE id = 7;

INSERT INTO Viaggiatori (nome, cognome, codiceFiscale, mail, telefono) VALUES
('Andrea', 'Bianchi', 'BNCAND85H08H501K', 'andrea.bianchi@example.com', '6677889900'),
('Elisa', 'Rossi', 'RSSELS92L09H501Y', 'elisa.rossi@example.com', '7788990011'),
('Francesco', 'Verdi', 'VRDFRC87M10H501T', 'francesco.verdi@example.com', '8899001122'),
('Giulia', 'Neri', 'NRIGLL93N11H501P', 'giulia.neri@example.com', '9900112233'),
('Alessandro', 'Gialli', 'GLIALS80O12H501M', 'alessandro.gialli@example.com', '0011223344'),
('Chiara', 'Russo', 'RSSCHR79P13H501L', 'chiara.russo@example.com', '1122384455'),
('Davide', 'Ferrari', 'FRRDVD95Q14H501Z', 'davide.ferrari@example.com', '2237445566'),
('Martina', 'Esposito', 'ESPMRT88R15H501X', 'martina.esposito@example.com', '3344056677'),
('Stefano', 'Conti', 'CNTSTF91S16H501W', 'stefano.conti@example.com', '4455661788'),
('Valentina', 'De Luca', 'DLUVLT94T17H501V', 'valentina.deluca@example.com', '5566758899');


-- Inserimento Guide
INSERT INTO Guide (nome, cognome) VALUES
('Mario', 'Rossi'), ('Laura', 'Bianchi'), ('Jean', 'Dupont'), ('Sophie', 'Martin'),
('John', 'Smith'), ('Emily', 'Johnson'), ('Yuki', 'Tanaka'), ('Hiroshi', 'Sato'),
('James', 'Brown'), ('Emma', 'Wilson'), ('Carlos', 'Garcia'), ('Ana', 'Lopez'),
('Michael', 'Schmidt'), ('Julia', 'Weber'), ('David', 'Jones'), ('Sarah', 'Brown'),
('Carlos', 'Silva'), ('Ana', 'Costa'), ('John', 'Doe'), ('Jane', 'Smith');

-- Inserimento Viaggiatori
INSERT INTO Viaggiatori (nome, cognome, codiceFiscale, mail, telefono) VALUES
('Elisa', 'Rossi', 'RSSELS92L09H501Y', 'elisa.rossi@example.com', '7788990011'),
('Francesco', 'Verdi', 'VRDFRC87M10H501T', 'francesco.verdi@example.com', '8899001122'),
('Giulia', 'Neri', 'NRIGLL93N11H501P', 'giulia.neri@example.com', '9900112233'),
('Alessandro', 'Gialli', 'GLIALS80O12H501M', 'alessandro.gialli@example.com', '0011223344'),
('Chiara', 'Russo', 'RSSCHR79P13H501L', 'chiara.russo@example.com', '1122334456'),
('Davide', 'Ferrari', 'FRRDVD95Q14H501Z', 'davide.ferrari@example.com', '2233445567'),
('Martina', 'Esposito', 'ESPMRT88R15H501X', 'martina.esposito@example.com', '3344556678'),
('Stefano', 'Conti', 'CNTSTF91S16H501W', 'stefano.conti@example.com', '4455667789'),
('Valentina', 'De Luca', 'DLUVLT94T17H501V', 'valentina.deluca@example.com', '5566778890');

-- Inserimento Viaggi_Guide
INSERT INTO Viaggi_Guide (viaggio_id, guida_id) VALUES
 (6, 12),
(7, 13), (7, 14), (8, 15), (8, 16),
(9, 17), (9, 18), (10, 19), (10, 20);

-- Inserimento Viaggi_Viaggiatori
INSERT INTO Viaggi_Viaggiatori (viaggio_id, viaggiatore_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6), (2, 7), (2, 8),
(3, 9), (3, 10), (3, 11), (3, 12),
(4, 13), (4, 14), (4, 15), (4, 16),
(5, 17), (5, 1), (5, 2), (5, 3),
(6, 4), (6, 5), (6, 6), (6, 7),
(7, 8), (7, 9), (7, 10), (7, 11),
(8, 12), (8, 13), (8, 14), (8, 15),
(9, 16), (9, 17), (9, 1), (9, 2),
(10, 3), (10, 4), (10, 5), (10, 6);

-- Assegnazione dei viaggiatori ai viaggi (minimo 6 per viaggio)
-- Aggiunta viaggiatori mancanti per garantire almeno 6 per viaggio
INSERT INTO Viaggi_Viaggiatori (viaggio_id, viaggiatore_id) VALUES
(1, 65), (2, 66), (3, 67), (4, 68), (5, 69), (6, 70), (7, 71), (8, 72), (9, 73), (10, 74);



UPDATE Viaggi 
SET inCorso = 1 
WHERE id IN (1, 3, 5, 7, 9);

-- DA AGGIUNGERE DATA DI NASCITA

ALTER TABLE Viaggiatori ADD COLUMN dataDiNascita VARCHAR(16);

UPDATE viaggiatori SET dataDiNascita = '1980-01-01' WHERE id = 1;
UPDATE viaggiatori SET dataDiNascita = '1985-02-02' WHERE id = 2;
UPDATE viaggiatori SET dataDiNascita = '1990-03-03' WHERE id = 3;
UPDATE viaggiatori SET dataDiNascita = '1995-04-04' WHERE id = 4;
UPDATE viaggiatori SET dataDiNascita = '1970-05-05' WHERE id = 5;
UPDATE viaggiatori SET dataDiNascita = '1975-06-06' WHERE id = 6;
UPDATE viaggiatori SET dataDiNascita = '1988-07-07' WHERE id = 7;
UPDATE viaggiatori SET dataDiNascita = '1985-08-08' WHERE id = 65;
UPDATE viaggiatori SET dataDiNascita = '1992-09-09' WHERE id = 66;
UPDATE viaggiatori SET dataDiNascita = '1987-10-10' WHERE id = 67;
UPDATE viaggiatori SET dataDiNascita = '1993-11-11' WHERE id = 68;
UPDATE viaggiatori SET dataDiNascita = '1980-12-12' WHERE id = 69;
UPDATE viaggiatori SET dataDiNascita = '1979-01-13' WHERE id = 70;
UPDATE viaggiatori SET dataDiNascita = '1995-02-14' WHERE id = 71;
UPDATE viaggiatori SET dataDiNascita = '1988-03-15' WHERE id = 72;
UPDATE viaggiatori SET dataDiNascita = '1991-04-16' WHERE id = 73;
UPDATE viaggiatori SET dataDiNascita = '1994-05-17' WHERE id = 74;
