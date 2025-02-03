import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { OpenAI } from "openai";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DATABASE_URL and OPENAI_API_KEY are defined
const databaseUrl = process.env.DATABASE_URL;
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!databaseUrl || !openaiApiKey) {
    throw new Error("DATABASE_URL and OPENAI_API_KEY must be defined in the .env file");
}

// PostgreSQL connection
const pool = new Pool({
    connectionString: databaseUrl,
});

// Set up OpenAI API client
const openai = new OpenAI({
    apiKey: openaiApiKey,
});

// Function to fetch compatible film stocks based on user input
const getFilteredFilmStocks = async (userAnswers: string[]) => {
    try {
        const isColor = userAnswers.includes("Color");
        const isLargeFormat = userAnswers.includes("Large Format");

        let query = `SELECT id, name, format, color FROM film_stocks WHERE color = $1`;
        const queryParams: (boolean | string)[] = [isColor];

        if (isLargeFormat) {
            query += ` AND EXISTS (
                SELECT 1 FROM unnest(format) AS f 
                WHERE f IN ('Large Format (4x5)', 'Large Format (8x10)')
            )`;
        }

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching film stocks:", error);
        return [];
    }
};

// Function to generate recommendations using OpenAI
const generateRecommendationsWithOpenAI = async (filmStocks: any[], userAnswers: string[]) => {
    try {
        const stockNames = filmStocks.map((f) => `"${f.name}"`).join(", ");
        const prompt = `Based on the user's preferences, rank the top 3 film stocks from this list: [${stockNames}]. Respond only with a JSON object:
        {
            "recommendations": ["Film Stock 1", "Film Stock 2", "Film Stock 3"]
        }
        Preferences: ${userAnswers.join(", ")}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a film photography expert. Rank the best 3 film stocks from the given list." },
                { role: "user", content: prompt }
            ],
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return [];

        return JSON.parse(content.replace(/```json|```/g, '').trim()).recommendations || [];
    } catch (error) {
        console.error("❌ Error generating recommendations from OpenAI:", error);
        return [];
    }
};

// API Route to get film recommendations
app.post("/api/recommendations", async (req: Request, res: Response): Promise<void> => {
    try {
        const userAnswers = req.body.answers ?? [];
        const filmStocks = await getFilteredFilmStocks(userAnswers);
        if (filmStocks.length === 0) {
            res.status(404).json({ error: "No matching film stocks found." });
            return;
        }

        const recommendations = await generateRecommendationsWithOpenAI(filmStocks, userAnswers);
        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE LOWER(name) IN (${recommendations.map((_: string, i: number) => `$${i + 1}`).join(", ")})`;
        const filmStockResult = await pool.query(filmStockQuery, recommendations.map((name: string) => name.toLowerCase()));

        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name.toLowerCase()] = row.id;
        });

        res.json({
            film_stock_1: filmStockMap[recommendations[0]?.toLowerCase()] ?? null,
            film_stock_2: filmStockMap[recommendations[1]?.toLowerCase()] ?? null,
            film_stock_3: filmStockMap[recommendations[2]?.toLowerCase()] ?? null
        });
    } catch (error) {
        console.error("❌ Error fetching recommendations", error);
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});

// API Route to get a single film stock by ID
app.get("/api/film-stocks/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid film stock ID" });
            return;
        }

        const result = await pool.query("SELECT * FROM film_stocks WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Film stock not found" });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error fetching film stock details", error);
        res.status(500).json({ error: "Error fetching film stock details" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
