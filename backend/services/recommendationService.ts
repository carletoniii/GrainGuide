import { Request, Response } from "express";
import { pool } from "../db";
import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../config";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getFilteredFilmStocks = async (userAnswers: string[]) => {
    try {
        console.log("🔍 Fetching film stocks for:", userAnswers);
        const isColor = userAnswers.includes("Color");
        const isLargeFormat = userAnswers.includes("Large Format");

        let query = `SELECT id, name, format, color FROM film_stocks WHERE color = $1`;
        const queryParams: (boolean | string)[] = [isColor];

        if (isLargeFormat) {
            query += ` AND format @> ARRAY['Large Format (4x5)', 'Large Format (8x10)']::text[]`;
        }

        const result = await pool.query(query, queryParams);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching film stocks:", error);
        return [];
    }
};

const generateRecommendationsWithOpenAI = async (filmStocks: { name: string }[]): Promise<string[]> => {
    try {
        console.log("🧠 Sending request to OpenAI...");
        const stockNames = filmStocks.map((f: { name: string }) => `"${f.name}"`).join(", ");
        const prompt = `Rank the top 3 film stocks from this list: [${stockNames}]. Respond with JSON: { "recommendations": ["Film Stock 1", "Film Stock 2", "Film Stock 3"] }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: "You are a film photography expert." }, { role: "user", content: prompt }],
        });

        const openAIResponse = response.choices[0]?.message?.content;
        if (!openAIResponse) throw new Error("Invalid OpenAI response: Empty content");

        let recommendations: string[] = [];
        try {
            recommendations = JSON.parse(openAIResponse.replace(/```json|```/g, "").trim()).recommendations || [];
        } catch (parseError) {
            console.error("❌ JSON parsing error from OpenAI response:", parseError);
        }

        return recommendations;
    } catch (error) {
        console.error("❌ OpenAI error, falling back to defaults:", error);
        return [];
    }
};

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const userAnswers = req.body.answers ?? [];
        if (!userAnswers.length) {
            return res.status(400).json({ error: "Missing user answers" });
        }

        const answerCombination = userAnswers.join(", "); // Store the joined answers once

        console.log("📌 Checking for existing recommendation for:", answerCombination);

        const existingRecommendation = await pool.query(
            `SELECT film_stock_1, film_stock_2, film_stock_3 FROM recommendations WHERE answer_combination = $1`,
            [answerCombination]
        );

        if (existingRecommendation.rows.length > 0) {
            return res.json(existingRecommendation.rows[0]);
        }

        const filmStocks = await getFilteredFilmStocks(userAnswers);
        if (filmStocks.length === 0) {
            return res.status(404).json({ error: "No matching film stocks found." });
        }

        let recommendations = await generateRecommendationsWithOpenAI(filmStocks);

        if (recommendations.length === 0) {
            recommendations = filmStocks.slice(0, 3).map(f => f.name);
        }

        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE LOWER(name) IN (${recommendations.map((_, i) => `$${i + 1}`).join(", ")})`;
        const filmStockResult = await pool.query(filmStockQuery, recommendations.map(name => name.toLowerCase()));

        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name.toLowerCase()] = row.id;
        });

        const film_stock_1 = filmStockMap[recommendations[0]?.toLowerCase()] ?? null;
        const film_stock_2 = filmStockMap[recommendations[1]?.toLowerCase()] ?? null;
        const film_stock_3 = filmStockMap[recommendations[2]?.toLowerCase()] ?? null;

        await pool.query(
            `INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3) VALUES ($1, $2, $3, $4) ON CONFLICT (answer_combination) DO NOTHING`,
            [answerCombination, film_stock_1, film_stock_2, film_stock_3]
        );

        return res.json({ film_stock_1, film_stock_2, film_stock_3 });
    } catch (error) {
        console.error("❌ Error handling recommendations:", error);
        return res.status(500).json({ error: "Error fetching/saving recommendations" });
    }
};
