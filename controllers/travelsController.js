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
                    return res.status(200).json({ status: "success", data: viaggiFinali});
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

const store = async (req, res) => {
    try {
        const { destinazione, dataPartenza, dataRitorno, guide } = req.body;

        // Genera lo slug univoco per il viaggio
        const slug = slugify(destinazione, {
            lower: true,
            strict: true
        });

        // Ottieni la data corrente nel fuso orario di Roma
        const dataCorrente = new Date().toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' });
        const [giorno, mese, anno] = dataCorrente.split('/');
        const dataSenzaOra = `${anno}-${mese.padStart(2, '0')}-${giorno.padStart(2, '0')}`;

        if (dataPartenza > dataRitorno) {
            return res.status(400).json({ status: "error", message: "La data di partenza non può essere successiva alla data di ritorno" });
        }

        // Verifica se il viaggio è in corso
        const inCorso = (dataSenzaOra >= dataPartenza && dataSenzaOra <= dataRitorno) ? 1 : 0;

        if (!guide || guide.length === 0) {
            return res.status(400).json({ status: "fail", message: "Il viaggio deve avere almeno una guida." });
        }

        // 1️⃣ INSERIRE IL VIAGGIO E OTTENERE IL SUO ID
        const sqlCreateViaggio = `
            INSERT INTO viaggi (slug, destinazione, dataPartenza, dataRitorno, inCorso)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [resultViaggio] = await connection.promise().query(sqlCreateViaggio, [slug, destinazione, dataPartenza, dataRitorno, inCorso]);
        const viaggioId = resultViaggio.insertId;

        // 2️⃣ RICAVARE GLI ID DELLE GUIDE (evitando duplicati)
        const guideSet = new Set(guide.map(g => `${g.nome.toLowerCase()}|${g.cognome.toLowerCase()}`)); // Evita duplicati basati su nome e cognome
        const guideIds = [];

        await Promise.all([...guideSet].map(async (guideKey) => {
            const [nome, cognome] = guideKey.split('|');

            // Controlla se la guida esiste già
            const sqlCheckGuida = `SELECT id FROM guide WHERE nome = ? AND cognome = ?`;
            const [existingGuide] = await connection.promise().query(sqlCheckGuida, [nome, cognome]);

            let guidaId;
            if (existingGuide.length > 0) {
                guidaId = existingGuide[0].id;
            } else {
                // Se la guida non esiste, la inseriamo
                const sqlInsertGuida = `INSERT INTO guide (nome, cognome) VALUES (?, ?)`;
                const [resultGuida] = await connection.promise().query(sqlInsertGuida, [nome, cognome]);
                guidaId = resultGuida.insertId;
            }

            guideIds.push(guidaId);
        }));

        // 3️⃣ INSERIRE LE RELAZIONI TRA VIAGGIO E GUIDE NELLA TABELLA PONTE
        if (guideIds.length > 0) {
            const sqlInsertViaggiGuide = `INSERT INTO viaggi_guide (viaggio_id, guida_id) VALUES ?`;
            const values = guideIds.map(guidaId => [viaggioId, guidaId]);
            await connection.promise().query(sqlInsertViaggiGuide, [values]);
        }

        return res.status(200).json({
            status: "success",
            message: "Viaggio e guide inseriti con successo",
            viaggioId,
            guideIds,
            slug: slug
        });

    } catch (err) {
        console.error("Errore nell'inserimento:", err);
        return res.status(500).json({ status: "error", message: "Errore nell'inserimento del viaggio e delle guide." });
    }
};



export default { index, store };
