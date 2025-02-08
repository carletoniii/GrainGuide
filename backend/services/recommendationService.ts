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

        console.log(`✅ Found ${result.rows.length} film stocks after filtering.`); // ✅ Log count

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
            try {
                const parsedResponse = JSON.parse(openAIResponse.replace(/```json|```/g, "").trim());
                recommendations = parsedResponse.recommendations || [];
            } catch (parseError) {
                console.error("❌ OpenAI response invalid:", openAIResponse);
                recommendations = filmStocks.slice(0, 3).map(f => f.name); // Fallback to top 3
            }

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

        // Extract film format
        const filmFormat = userAnswers[0]; // First question is now film format

        // 📌 Ensure Instant Film bypasses AI-based recommendations
        if (filmFormat === "Instant Film") {
            const instantFilmType = userAnswers.find((ans: string) => [
                "Fujifilm Instax Mini",
                "Fujifilm Instax Square",
                "Fujifilm Instax Wide",
                "Polaroid i-Type",
                "Polaroid 600",
                "Polaroid SX-70",
                "Polaroid 8x10"
            ].includes(ans));

            const instantFilmMap: Record<string, number> = {
                "Fujifilm Instax Mini": 33,
                "Fujifilm Instax Square": 34,
                "Fujifilm Instax Wide": 35,
                "Polaroid i-Type": 36,
                "Polaroid 600": 37,
                "Polaroid SX-70": 38,
                "Polaroid 8x10": 39
            };

            const filmStockId = instantFilmMap[instantFilmType!] || null;

            if (!filmStockId) {
                return res.status(404).json({ error: "Invalid Instant Film selection" });
            }

            return res.json({ film_stock_1: filmStockId, film_stock_2: null, film_stock_3: null });
        }

        // ⬇️ Fetch filtered film stocks
        const filmStocks = await getFilteredFilmStocks(userAnswers);
        console.log(`✅ Retrieved ${filmStocks.length} film stocks after filtering.`);

        if (filmStocks.length < 3) {
            console.warn("⚠️ Low film stock count—risk of weak recommendations. Consider adjusting filters.");
        }

        let recommendations = await generateRecommendationsWithOpenAI(filmStocks);
        if (recommendations.length === 0) {
            console.log("⚠️ OpenAI failed—defaulting to first 3 film stocks.");
            recommendations = filmStocks.slice(0, 3).map(f => f.name);
        }
        console.log("✅ Final recommendations:", recommendations);

        const filmStockQuery = `SELECT id, name FROM film_stocks WHERE LOWER(name) IN (${recommendations.map((_, i) => `$${i + 1}`).join(", ")})`;
        const filmStockResult = await pool.query(filmStockQuery, recommendations.map(name => name.toLowerCase()));

        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name.toLowerCase()] = row.id;
        });

        const film_stock_1 = filmStockMap[recommendations[0]?.toLowerCase()] ?? null;
        const film_stock_2 = filmStockMap[recommendations[1]?.toLowerCase()] ?? null;
        const film_stock_3 = filmStockMap[recommendations[2]?.toLowerCase()] ?? null;

        if (filmFormat !== "Instant Film") {
            await pool.query(
                `INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3) VALUES ($1, $2, $3, $4) ON CONFLICT (answer_combination) DO NOTHING`,
                [userAnswers.join(", "), film_stock_1, film_stock_2, film_stock_3]
            );
        }

        return res.json({ film_stock_1, film_stock_2, film_stock_3 });
    } catch (error) {
        console.error("❌ Error handling recommendations:", error);
        return res.status(500).json({ error: "Error fetching/saving recommendations" });
    }
};
