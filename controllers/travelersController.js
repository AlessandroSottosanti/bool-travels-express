import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    const slug = req.params.slug;  
    console.log("slug:", slug);

    // query verifica esistenza viaggio
    const sqlTravel = `
        SELECT * FROM viaggi
        WHERE viaggi.slug = ?
    `;

    // Controlla che il viaggio con slug :slug esista
    connection.query(sqlTravel, slug, (err, results) => {
        if (err) {
            return next(err);
        } 

        else if(results.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Viaggio non trovato",
            });
        }

        return;
    });


    let sql = `SELECT Viaggiatori.*
FROM 
    Viaggiatori
INNER JOIN 
    Viaggi_Viaggiatori ON Viaggiatori.id = Viaggi_Viaggiatori.Viaggiatore_id
INNER JOIN 
    Viaggi ON Viaggi_Viaggiatori.viaggio_id = Viaggi.id
WHERE 
    Viaggi.slug = ?  -- Aggiungi lo slug come filtro
ORDER BY 
    Viaggi.destinazione, Viaggi.dataPartenza`;

    const params = [slug];  // Passa lo slug come parametro alla query

    // Gestione del filtro "search" (se presente nella query string)
    const filters = req.query;
    if (filters.search) {
        sql += " AND (Viaggiatori.nome LIKE ? OR Viaggiatori.cognome LIKE ?)";
        params.push(`%${filters.search}%`);
        params.push(`%${filters.search}%`);
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            return next(err);
        } 
        
        else if(results.length === 0) {
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
};

export default { index };
