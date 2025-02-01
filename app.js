import express from "express";
import notFoundPage from './middlewares/notFoundRoute.js';
import handleError from "./middlewares/handleError.js";
import cors from "cors";
import travelsRouter from "./routers/travels.js"
import travelersRouter from "./routers/travelers.js"


const app = express(); // Inizializza l'app Express

const port = process.env.SERVER_PORT; // Porta su cui il server ascolterà

app.use(cors({
    origin: process.env.FRONTEND_URL,
}))

app.use(express.json());

app.use(express.static("public"));

// Definisci una rotta di base
app.use("/travels", travelsRouter);

app.use("/travels/travelers", travelersRouter)

app.use(notFoundPage.notFoundRoute);
app.use(handleError);

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
