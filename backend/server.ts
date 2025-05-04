// backend/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getRecommendations } from "./services/recommendationService";
import { getFilmStockById, getAllFilmStocks } from "./services/filmStockService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/api/film-stocks/:id", async (req: Request, res: Response) => {
    try {
        await getFilmStockById(req, res);
    } catch (error) {
        console.error("❌ Error in filmStock/:id route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Add this route for catalog access
app.get("/api/film-stocks", async (req: Request, res: Response) => {
    try {
        await getAllFilmStocks(req, res);
    } catch (error) {
        console.error("❌ Error in filmStock GET route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
        await getRecommendations(req, res);
    } catch (error) {
        console.error("❌ Error in recommendations route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
