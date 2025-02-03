import slugify from "slugify";
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

const store = (req, res, next) => {
    const { destinazione, dataPartenza, dataRitorno, guide } = req.body;

    const slug = slugify(destinazione, {
        lower: true,
        strict: true
    });

    const dataCorrente = new Date(); // Data corrente

    const inCorso = (dataCorrente >= dataPartenza && dataCorrente <= dataRitorno) ? 1 : 0;

    // Verifica se ci sono guide
    if (guide.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Il viaggio deve avere almeno una guida.",
            dettagli: "La lista delle guide è vuota."
        });
    }

    // Verifica se il nome e cognome delle guide sono validi
    for (const guida of guide) {
        if ((guida.nome.length || guida.cognome.length) < 3) {
            return res.status(400).json({
                status: "fail",
                message: "Il nome ed il cognome devono contenere almeno 3 caratteri",
                dettagli: `La guida ${guida.nome} ${guida.cognome} ha un nome o cognome troppo corto.`
            });
        }
    }

    // Query di inserimento
    const sqlCreate = `
    INSERT INTO viaggi (slug, destinazione, dataPartenza, dataRitorno, inCorso)
    VALUES (?, ?, ?, ?, ?);
    `;

    connection.query(sqlCreate, [slug, destinazione, dataPartenza, dataRitorno, inCorso], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "fail",
                message: "Errore nel salvataggio del viaggio.",
                dettagli: err.message // Aggiungi il messaggio di errore dal database
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Viaggio creato con successo",
            data: results,
        });
    });
};


export default { index, store };
