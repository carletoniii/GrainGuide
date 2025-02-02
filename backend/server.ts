import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// API Route: Get all film stocks
app.get("/api/film-stocks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM film_stocks ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching film stocks:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// API Route: Get recommendations based on user answers
app.post("/api/recommendations", async (req, res) => {
    const userAnswers = req.body.answers;  // Expecting an array of answers

    try {
        // Create the answer combination string
        const answerCombination = userAnswers.join(',');

        // Query recommendations
        const result = await pool.query(`
            SELECT * FROM recommendations
            WHERE answer_combination = $1
        `, [answerCombination]);

        if (result.rows.length > 0) {
            // If a match is found, return the recommendations
            const recommendation = result.rows[0]; // Get the first match
            res.json({
                film_stock_1: recommendation.film_stock_1,
                film_stock_2: recommendation.film_stock_2,
                film_stock_3: recommendation.film_stock_3
            });
        } else {
            // If no recommendations, send empty response
            res.json([]);
        }
    } catch (err) {
        console.error("❌ Error fetching recommendations", err);
        res.status(500).send("Error fetching recommendations");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
