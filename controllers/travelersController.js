import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    try {
        const slug = req.params.slug;  

        // query verifica esistenza viaggio
        const sqlTravel = `
            SELECT * FROM viaggi
            WHERE viaggi.slug = ?
        `;

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

            // Impostazione della query per i viaggiatori
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

            const params = [slug];  // Parametro iniziale per lo slug

            // Gestione del filtro di ricerca se presente
            const filters = req.query;
            console.log("filters:", filters.search);
            if (filters.search) {
                sql += " AND (Viaggiatori.nome LIKE ? OR Viaggiatori.cognome LIKE ?)";
                params.push(`%${filters.search}%`);
                params.push(`%${filters.search}%`);
            }

            // Esegui la query per ottenere i viaggiatori filtrati
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
    } catch (globalError) {
        console.error("Errore generico nel controller:", globalError);
        return res.status(500).json({ status: "error", message: "Errore interno del server." });
    }
};

export default { index };
