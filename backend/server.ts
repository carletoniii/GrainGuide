import express from "express";
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

// Function to generate recommendations using OpenAI
const generateRecommendationsWithOpenAI = async (userAnswers: string[]) => {
    try {
        const prompt = `Based on the following photography preferences, select exactly three film stocks.
        Respond only with three numbered film stocks in this format:
        ["1. Film Name: Description", "2. Film Name: Description", "3. Film Name: Description"]
        
        Preferences: ${userAnswers.join(", ")}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a film photography expert. Respond only with a JSON array containing three film stock recommendations." },
                { role: "user", content: prompt }
            ]
        });

        let responseArray = JSON.parse(response.choices[0]?.message?.content ?? "[]");

        if (!Array.isArray(responseArray) || responseArray.length < 3) {
            console.error("Unexpected OpenAI response format. Using fallback recommendations.");
            return [1, 2, 3];
        }

        let filmStockIds = responseArray.slice(0, 3).map(entry => {
            const match = entry.match(/^\d+/); // Extract leading number
            return match ? parseInt(match[0], 10) : null;
        }).filter(num => num !== null);

        if (filmStockIds.length !== 3) {
            console.error("Failed to extract three valid film stock IDs. Using fallback.");
            return [1, 2, 3];
        }

        return filmStockIds;
    } catch (error) {
        console.error("❌ Error generating recommendations from OpenAI:", error);
        return [1, 2, 3];
    }
};

// API Routes
app.post("/api/recommendations", async (req, res) => {
    const userAnswers = req.body.answers ?? [];

    try {
        const answerCombination = userAnswers.join(",");
        const result = await pool.query(
            `SELECT * FROM recommendations WHERE answer_combination = $1`,
            [answerCombination]
        );

        if (result.rows.length > 0) {
            const recommendation = result.rows[0];
            res.json({
                film_stock_1: recommendation.film_stock_1,
                film_stock_2: recommendation.film_stock_2,
                film_stock_3: recommendation.film_stock_3
            });
        } else {
            const openAiResponse = await generateRecommendationsWithOpenAI(userAnswers);
            await pool.query(
                `INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (answer_combination) DO NOTHING`,
                [
                    answerCombination,
                    openAiResponse[0],
                    openAiResponse[1],
                    openAiResponse[2]
                ]
            );
            res.json(openAiResponse);
        }
    } catch (error) {
        console.error("❌ Error fetching recommendations", error);
        res.status(500).send("Error fetching recommendations");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
