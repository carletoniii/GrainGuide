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

        console.log("🟢 Generated Query:", query);
        console.log("🟢 Query Parameters:", queryParams);

        const result = await pool.query(query, queryParams);

        console.log("🔵 Query Result (Rows Returned):", result.rows);

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
        const prompt = `Based on the user's preferences, rank the top 3 film stocks from this list:
[${stockNames}]. Respond **only** with a JSON object formatted like this:

{
    "recommendations": ["Film Stock 1", "Film Stock 2", "Film Stock 3"]
}

Preferences: ${userAnswers.join(", ")}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a film photography expert. Rank the best 3 film stocks from the given list and respond with a JSON object containing only film stock names." },
                { role: "user", content: prompt }
            ],
        });

        console.log("🟢 OpenAI Raw Response:", response);

        const content = response.choices[0]?.message?.content;
        if (!content) {
            console.error("❌ OpenAI returned an empty response.");
            return [];
        }

        const cleanedResponse = content.replace(/```json|```/g, '').trim();
        try {
            const parsedResponse = JSON.parse(cleanedResponse);
            console.log("🟢 Parsed OpenAI Response:", parsedResponse);
            return parsedResponse.recommendations || [];
        } catch (error) {
            console.error("❌ Error parsing OpenAI response:", error);
            return [];
        }
    } catch (error) {
        console.error("❌ Error generating recommendations from OpenAI:", error);
        return [];
    }
};

// API Route to get film recommendations
app.post("/api/recommendations", async (req: Request, res: Response): Promise<void> => {
    try {
        const userAnswers = req.body.answers ?? [];

        // If Instant Film is selected, return only the selected instant film type
        const instantFilmMapping: Record<string, string> = {
            "Fujifilm Instax Mini": "Fujifilm Instax Mini",
            "Fujifilm Instax Square": "Fujifilm Instax Square",
            "Fujifilm Instax Wide": "Fujifilm Instax Wide",
            "Polaroid i-Type": "Polaroid i-Type Film",
            "Polaroid 600": "Polaroid 600 Film",
            "Polaroid SX-70": "Polaroid SX-70 Film",
            "Polaroid 8x10": "Polaroid 8x10 Film"
        };

        // Check if instant film was selected
        const selectedInstantFilm = userAnswers.find((answer: string) => instantFilmMapping[answer]);

        if (selectedInstantFilm) {
            const filmNameInDatabase = instantFilmMapping[selectedInstantFilm];

            const instantFilmQuery = `SELECT id, name FROM film_stocks WHERE name = $1`;
            const instantFilmResult = await pool.query(instantFilmQuery, [filmNameInDatabase]);

            if (instantFilmResult.rows.length > 0) {
                res.json({
                    film_stock_1: instantFilmResult.rows[0].id,
                    film_stock_2: null,
                    film_stock_3: null
                });
                return;
            } else {
                res.status(404).json({ error: "Selected instant film type not found in database." });
                return;
            }
        }

        // Continue as normal for other film types
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
        if (openAiResponse.length === 0) {
            res.status(404).json({ error: "AI could not generate recommendations." });
            return;
        }

        // Convert OpenAI film stock names to IDs using `IN` instead of `ANY`
        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE LOWER(name) IN (${openAiResponse.map((_: string, i: number) => `$${i + 1}`).join(", ")})`;
        const filmStockResult = await pool.query(filmStockQuery, openAiResponse.map((name: string) => name.toLowerCase()));

        console.log("🟢 Retrieved Film Stock IDs from Database:", filmStockResult.rows);

        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name.toLowerCase()] = row.id;
        });

        const filmStockIds: (number | null)[] = openAiResponse
            .map((name: string) => {
                const id = filmStockMap[name.toLowerCase()] ?? null;
                if (!id) console.log(`⚠️ No match found for film stock: ${name}`);
                return id;
            })
            .filter((id: number | null): id is number => id !== null);

        res.json({
            film_stock_1: filmStockIds[0] ?? null,
            film_stock_2: filmStockIds[1] ?? null,
            film_stock_3: filmStockIds[2] ?? null
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
