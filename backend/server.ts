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
        // Extract color preference from answers
        const isColor = userAnswers.includes("Color") ? true : false;
        const isInstantFilm = userAnswers.includes("Instant Film");
        const isLargeFormat = userAnswers.includes("Large Format");

        console.log("🔍 Fetching film stocks with color:", isColor);

        // Modify the query to account for the Instant Film and Large Format answers
        let query = `SELECT id, name FROM film_stocks WHERE color = $1`;
        const queryParams = [isColor];

        // Add conditions based on Instant Film or Large Format selection
        if (isInstantFilm) {
            query += ` AND format @> '{"Instant Film"}'`;  // Filter for Instant Film
        }
        if (isLargeFormat) {
            query += ` AND format @> '{"Large Format"}'`;  // Filter for Large Format
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
        const stockNames = filmStocks.map((f) => f.name).join(", ");
        const prompt = `Based on the user's preferences, rank the top 3 film stocks from this list:
        [${stockNames}]. Respond **only** with a JSON object containing "recommendations".

        Preferences: ${userAnswers.join(", ")}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a film photography expert. Rank the best 3 film stocks from the given list and respond with a JSON object." },
                { role: "user", content: prompt }
            ],
        });

        console.log("🔍 OpenAI Response:", response.choices[0]?.message?.content);

        // Parse the response correctly and return the film stocks
        const parsedResponse = JSON.parse(response.choices[0]?.message?.content ?? "{}");
        const openAiResponse = parsedResponse.recommendations?.map((rec: any) => rec.film_stock) || [];

        return openAiResponse;
    } catch (error) {
        console.error("❌ Error generating recommendations from OpenAI:", error);
        return [];
    }
};

// API Route to get film recommendations
app.post("/api/recommendations", async (req: Request, res: Response): Promise<void> => {
    try {
        const userAnswers = req.body.answers ?? [];

        // Create a unique key for this answer set
        const answerCombination = userAnswers.join(",");

        // Check if recommendations already exist
        const existingResult = await pool.query(
            `SELECT * FROM recommendations WHERE answer_combination = $1`,
            [answerCombination]
        );

        if (existingResult.rows.length > 0) {
            res.json({
                film_stock_1: existingResult.rows[0].film_stock_1,
                film_stock_2: existingResult.rows[0].film_stock_2,
                film_stock_3: existingResult.rows[0].film_stock_3
            });
            return;
        }

        // Fetch film stocks based on user answers
        const filmStocks = await getFilteredFilmStocks(userAnswers);

        // If no film stocks match, relax filters or return an error
        if (filmStocks.length === 0) {
            res.status(404).json({ error: "No matching film stocks found. Try adjusting your preferences." });
            return;
        }

        // Get top recommendations from OpenAI
        const openAiResponse = await generateRecommendationsWithOpenAI(filmStocks, userAnswers);

        // Convert film stock names to IDs
        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE name = ANY($1::text[])`;
        const filmStockResult = await pool.query(filmStockQuery, [openAiResponse]);

        // Create a mapping of film stock names to IDs
        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name] = row.id;
        });

        // Ensure we have valid IDs for all recommendations
        const filmStockIds: number[] = openAiResponse
            .map((name: string) => filmStockMap[name])
            .filter((id: number | undefined): id is number => id !== undefined);

        if (filmStockIds.length !== 3) {
            res.status(500).json({ error: "Some recommended film stocks are not in the database." });
            return;
        }

        // Store the recommendations in the database
        await pool.query(
            `INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (answer_combination) DO NOTHING`,
            [answerCombination, filmStockIds[0], filmStockIds[1], filmStockIds[2]]
        );

        res.json({
            film_stock_1: filmStockIds[0],
            film_stock_2: filmStockIds[1],
            film_stock_3: filmStockIds[2]
        });

    } catch (error) {
        console.error("❌ Error fetching recommendations", error);
        res.status(500).json({ error: "Error fetching recommendations" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
