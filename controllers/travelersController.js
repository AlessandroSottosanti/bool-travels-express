import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    try {
        const slug = req.params.slug;

        const sqlTravel = `
            SELECT * FROM viaggi
            WHERE viaggi.slug = ?
        `;

        if (slug) {
            connection.query(sqlTravel, slug, (err, results) => {
                if (err) {
                    console.error("Errore nella query del viaggio:", err);
                    return res.status(500).json({ status: "error", message: "Errore nel recupero del viaggio." });
                }
                else if (results.length === 0) {
                    return res.status(404).json({
                        status: "error",
                        message: "Viaggio non trovato",
                    });
                }

                let sql = `
                SELECT Viaggiatori.*
                FROM 
                    Viaggiatori
                INNER JOIN 
                    Viaggi_Viaggiatori ON Viaggiatori.id = Viaggi_Viaggiatori.Viaggiatore_id
                INNER JOIN 
                    Viaggi ON Viaggi_Viaggiatori.viaggio_id = Viaggi.id
                WHERE 
                    Viaggi.slug = ?
                
            `;

                const params = [slug];  

                const filters = req.query;
                console.log("filters:", filters.search);
                if (filters.search) {
                    sql += " AND (Viaggiatori.nome LIKE ? OR Viaggiatori.cognome LIKE ?)";
                    params.push(`%${filters.search}%`);
                    params.push(`%${filters.search}%`);
                }

                connection.query(sql, params, (err, results) => {
                    if (err) {
                        console.error("Errore nella query dei viaggiatori:", err);
                        return res.status(500).json({ status: "error", message: "Errore nel recupero dei viaggiatori." });
                    }
                    else if (results.length === 0) {
                        return res.status(404).json({
                            status: "error",
                            message: "Nessun Viaggiatore trovato",
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: "success",
                            data: results,
                        });
                    }
                });
            });
        }
    } catch (globalError) {
        console.error("Errore generico nel controller:", globalError);
        return res.status(500).json({ status: "error", message: "Errore interno del server." });
    }
};

const store = async (req, res, next) => {
    const slug = req.params.slug;  
    const viaggiatori = req.body.viaggiatori;  

    if (!viaggiatori || !Array.isArray(viaggiatori) || viaggiatori.length === 0) {
        return res.status(400).json({ status: "error", message: "Nessun viaggiatore fornito." });
    }

    try {

        const sqlTravel = `SELECT id FROM viaggi WHERE slug = ?`;
        const [travelResults] = await connection.promise().query(sqlTravel, [slug]);

        if (travelResults.length === 0) {
            return res.status(404).json({ status: "error", message: "Viaggio non trovato." });
        }

        const viaggioId = travelResults[0].id; 

        let viaggiatoriConDuplicati = [];
        let viaggiatoriDaInserire = [];


        for (const viaggiatore of viaggiatori) {
            const { nome, cognome, mail, telefono, codiceFiscale, dataDiNascita } = viaggiatore;

            const sqlCheckDuplicate = `
                SELECT id FROM Viaggiatori
                WHERE nome = ? AND cognome = ? AND mail = ?`;
            const [duplicateResults] = await connection.promise().query(sqlCheckDuplicate, [nome, cognome, mail]);

            if (duplicateResults.length > 0) {

                const viaggiatoreId = duplicateResults[0].id;

                const sqlCheckLink = `
                    SELECT * FROM Viaggi_Viaggiatori
                    WHERE viaggio_id = ? AND Viaggiatore_id = ?`;
                const [linkResults] = await connection.promise().query(sqlCheckLink, [viaggioId, viaggiatoreId]);

                if (linkResults.length === 0) {

                    const sqlLinkTravelers = `
                        INSERT INTO Viaggi_Viaggiatori (viaggio_id, Viaggiatore_id) VALUES (?, ?)`;
                    await connection.promise().query(sqlLinkTravelers, [viaggioId, viaggiatoreId]);
                }

                viaggiatoriConDuplicati.push(viaggiatore);
            } else {
                viaggiatoriDaInserire.push({ nome, cognome, mail, telefono, codiceFiscale, dataDiNascita  });
            }
        }

        if (viaggiatoriDaInserire.length > 0) {
            const sqlInsert = `INSERT INTO Viaggiatori (nome, cognome, mail, telefono, codiceFiscale, dataDiNascita ) VALUES ?`;

            const viaggiatoriValues = viaggiatoriDaInserire.map(v => [
                v.nome, v.cognome, v.mail, v.telefono, v.codiceFiscale, v.dataDiNascita 
            ]);

            const [insertResults] = await connection.promise().query(sqlInsert, [viaggiatoriValues]);

            const viaggiatoriLinkValues = [];
            for (let i = 0; i < viaggiatoriDaInserire.length; i++) {
                viaggiatoriLinkValues.push([viaggioId, insertResults.insertId + i]);
            }

            const sqlLinkTravelers = `
                INSERT INTO Viaggi_Viaggiatori (viaggio_id, Viaggiatore_id) VALUES ?`;
            await connection.promise().query(sqlLinkTravelers, [viaggiatoriLinkValues]);
        }

        return res.status(200).json({
            status: "success",
            message: "Viaggiatori aggiunti correttamente.",
            data: {
                viaggiatoriInseriti: viaggiatoriDaInserire,
                viaggiatoriConDuplicati,
            }
        });
    } catch (err) {
        console.error("Errore durante l'elaborazione:", err);
        return res.status(500).json({ status: "error", message: "Errore durante l'elaborazione.", details: err });
    }
};


export default { index, store };
