import express from "express";
import travelsController from "../controllers/travelsController.js";

const router = express.Router();

// INDEX
router.get("/", travelsController.index);

export default router;