import express from "express";
import travelersController from "../controllers/travelersController.js";

const router = express.Router();

// INDEX
router.get("/:slug", travelersController.index);

router.post("/:slug", travelersController.store);


export default router;