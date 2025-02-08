import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getRecommendations } from "./services/recommendationService";  // ✅ Corrected path
import { getFilmStockById } from "./services/filmStockService";  // ✅ Corrected path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Wrap async handlers to properly handle Express requests
app.get("/api/film-stocks/:id", async (req: Request, res: Response) => {
    try {
        await getFilmStockById(req, res); // Call the function with req and res
    } catch (error) {
        console.error("❌ Error in filmStock route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
        await getRecommendations(req, res); // Call the function with req and res
    } catch (error) {
        console.error("❌ Error in recommendations route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
