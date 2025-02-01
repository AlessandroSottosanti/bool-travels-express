import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    
    let sqlViaggi = `SELECT * FROM viaggi`;

    connection.query(sqlViaggi, (err, viaggiResults) => {
        if (err) {
            return next(err);
        }

        let sqlGuide = `SELECT viaggi.id AS viaggio_id, guide.id AS guida_id, guide.nome AS nome_guida, guide.cognome AS cognome_guida
                        FROM viaggi
                        INNER JOIN viaggi_guide 
                        ON viaggi.id = viaggi_guide.viaggio_id
                        INNER JOIN guide 
                        ON viaggi_guide.guida_id = guide.id`;

        connection.query(sqlGuide, (err, guideResults) => {
            if (err) {
                return next(err);
            }

            let viaggiMap = {};

            viaggiResults.forEach(viaggio => {
                viaggiMap[viaggio.id] = { 
                    ...viaggio, 
                    guide: []  
                };
            });

            // Inseriamo le guide nei rispettivi viaggi
            guideResults.forEach(guida => {
                const idViaggio = guida.viaggio_id;

                if (viaggiMap[idViaggio]) {
                    viaggiMap[idViaggio].guide.push({
                        id: guida.guida_id,
                        nome: guida.nome_guida,
                        cognome: guida.cognome_guida
                    });
                }
            });

            // Convertiamo la mappa in un array di viaggi
            const viaggiFinali = Object.values(viaggiMap);

            return res.status(200).json({
                status: "success",
                data: viaggiFinali,
            });
        });
    });
};

export default { index };