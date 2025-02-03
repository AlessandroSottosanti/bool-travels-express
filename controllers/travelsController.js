import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    try {
        let sqlViaggi = `SELECT * FROM viaggi`;

        connection.query(sqlViaggi, (err, viaggiResults) => {
            if (err) {
                console.error("Errore nella query dei viaggi:", err);
                return res.status(500).json({ status: "error", message: "Errore nel recupero dei viaggi." });
            }

            let sqlGuide = `SELECT viaggi.id AS viaggio_id, guide.id AS guida_id, guide.nome AS nome_guida, guide.cognome AS cognome_guida
                            FROM viaggi
                            INNER JOIN viaggi_guide 
                            ON viaggi.id = viaggi_guide.viaggio_id
                            INNER JOIN guide 
                            ON viaggi_guide.guida_id = guide.id`;

            connection.query(sqlGuide, (err, guideResults) => {
                if (err) {
                    console.error("Errore nella query delle guide:", err);
                    return res.status(500).json({ status: "error", message: "Errore nel recupero delle guide." });
                }

                try {
                    let viaggiMap = {};

                    viaggiResults.forEach(viaggio => {
                        viaggiMap[viaggio.id] = { 
                            ...viaggio, 
                            guide: []  
                        };
                    });

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

                    const viaggiFinali = Object.values(viaggiMap);
                    return res.status(200).json({ status: "success", data: viaggiFinali });
                } catch (processingError) {
                    console.error("Errore durante l'elaborazione dei dati:", processingError);
                    return res.status(500).json({ status: "error", message: "Errore durante l'elaborazione dei dati." });
                }
            });
        });
    } catch (globalError) {
        console.error("Errore generico nel controller:", globalError);
        return res.status(500).json({ status: "error", message: "Errore interno del server." });
    }
};

export default { index };
