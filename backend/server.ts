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
        const isColor = userAnswers.includes("Color") ? true : false;
        const isInstantFilm = userAnswers.includes("Instant Film");
        const isLargeFormat = userAnswers.includes("Large Format");
        const is35mm = userAnswers.includes("35mm");
        const is120mm = userAnswers.includes("120 (Medium Format)");

        // Start the query by checking for color preference
        let query = `SELECT id, name FROM film_stocks WHERE color = $1`;
        const queryParams: (boolean | string)[] = [isColor];

        // Add format filters with proper PostgreSQL array matching
        if (is35mm) {
            query += ` AND format @> ARRAY['35mm']::text[]`;  // PostgreSQL array literal syntax
        }
        if (is120mm) {
            query += ` AND format @> ARRAY['120']::text[]`;
        }

        // If Instant Film is selected, check for specific instant films
        if (isInstantFilm) {
            query += ` AND (format @> '{"Fujifilm Instax Mini"}' OR format @> '{"Fujifilm Instax Square"}' OR format @> '{"Fujifilm Instax Wide"}' OR format @> '{"Polaroid i-Type"}' OR format @> '{"Polaroid 600"}' OR format @> '{"Polaroid SX-70"}' OR format @> '{"Polaroid 8x10"}')`;
        }

        // If Large Format is selected, check for 4x5 or 8x10 formats in the "Large Format" group
        if (isLargeFormat) {
            query += ` AND (format @> '{"Large Format (4x5)"}' OR format @> '{"Large Format (8x10)"}')`;
        }

        // Log the query to ensure it's formed correctly
        console.log("Generated Query:", query);
        console.log("Query Parameters:", queryParams);

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching film stocks:", error);
        return [];
    }
};

// Function to generate recommendations using OpenAI
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

        // Clean the response to remove markdown/code block formatting
        const content = response.choices[0]?.message?.content;
        const cleanedResponse = content ? content.replace(/```json|```/g, '').trim() : '';

        // Parse the cleaned response
        const parsedResponse = JSON.parse(cleanedResponse ?? "{}");
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

        const answerCombination = userAnswers.join(",");

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

        const filmStocks = await getFilteredFilmStocks(userAnswers);

        if (filmStocks.length === 0) {
            res.status(404).json({ error: "No matching film stocks found. Try adjusting your preferences." });
            return;
        }

        const openAiResponse = await generateRecommendationsWithOpenAI(filmStocks, userAnswers);

        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE name = ANY($1::text[])`;
        const filmStockResult = await pool.query(filmStockQuery, [openAiResponse]);

        // Debugging: Log the film stock map
        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name] = row.id;
        });

        // Debugging: Check the map content
        console.log("Film Stock Map:", filmStockMap);

        // Convert film stock names to IDs
        const filmStockIds: (number | null)[] = openAiResponse
            .map((name: string) => filmStockMap[name] ?? null)
            .filter((id: number | null): id is number => id !== null);

        // Debugging: Check the final IDs before responding
        console.log("Film Stock IDs for Response:", filmStockIds);

        // Fill in missing recommendations with null if fewer than 3
        const recommendations = [
            filmStockIds[0] ?? null,
            filmStockIds[1] ?? null,
            filmStockIds[2] ?? null
        ];

        // Store the recommendations in the database, allowing NULLs
        await pool.query(
            `INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (answer_combination) DO NOTHING`,
            [answerCombination, recommendations[0], recommendations[1], recommendations[2]]
        );

        res.json({
            film_stock_1: recommendations[0],
            film_stock_2: recommendations[1],
            film_stock_3: recommendations[2]
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
