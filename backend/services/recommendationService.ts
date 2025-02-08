import { Request, Response } from "express";
import { pool } from "../db";
import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../config";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const formatMap: Record<string, string> = {
    "35mm": "35mm",
    "120 (Medium Format)": "120",
    "Large Format": "Large Format (4x5)",
    "Instant Film": "Instant Film"
};

const getFilteredFilmStocks = async (userAnswers: string[]) => {
    try {
        console.log("🔍 Fetching film stocks for:", userAnswers);
        const isColor = userAnswers.includes("Color");
        const format = formatMap[userAnswers[0]] || userAnswers[0]; // Normalize format

        console.log(`🎨 Filter Color: Expecting ${isColor ? "Color" : "Black & White"}`);
        console.log(`🎞️ Filter Format: ${format}`);

        // ✅ Fixed SQL Query (now correctly filtering format & color)
        let query = `
            SELECT id, name, format, color, iso
            FROM film_stocks
            WHERE color = $1
            AND format @> ARRAY[$2]::text[];
        `;
        const queryParams: (boolean | string)[] = [isColor, format];

        console.log(`📝 Executing SQL: ${query} with params:`, queryParams);

        const result = await pool.query(query, queryParams);

        console.log(`✅ Found ${result.rows.length} film stocks after filtering.`);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching film stocks:", error);
        return [];
    }
};

const generateRecommendationsWithOpenAI = async (filmStocks: { name: string, iso: number }[], userAnswers: string[]): Promise<string[]> => {
    try {
        console.log("🧠 Sending request to OpenAI...");

        // 🚨 Debugging: Log films before sending to OpenAI
        filmStocks.forEach(film => console.log(`📜 Sending to OpenAI: ${film.name} (ISO: ${film.iso})`));

        if (filmStocks.length === 0) {
            console.warn("⚠️ No matching film stocks found. Asking OpenAI for general recommendations.");
            return [];
        }

        const stockList = filmStocks.map((f) => `"${f.name}" (ISO ${f.iso})`).join(", ");
        const userPreferences = userAnswers.slice(1).join(", ");

        const prompt = `Rank the top 3 film stocks from this list: [${stockList}].
        The user is looking for a film stock that matches these preferences: ${userPreferences}.
        Prioritize films with the **highest possible ISO**, but if high-ISO films are unavailable, recommend the best alternative.
        Respond with JSON: { "recommendations": ["Film Stock 1", "Film Stock 2", "Film Stock 3"] }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: "You are a film photography expert." }, { role: "user", content: prompt }],
        });

        const openAIResponse = response.choices[0]?.message?.content;
        if (!openAIResponse) throw new Error("Invalid OpenAI response: Empty content");

        console.log(`🧠 OpenAI Raw Response: ${openAIResponse}`);

        let recommendations: string[] = [];
        try {
            const parsedResponse = JSON.parse(openAIResponse.replace(/```json|```/g, "").trim());
            if (Array.isArray(parsedResponse.recommendations)) {
                recommendations = parsedResponse.recommendations.map((name: string) => name.split(" (ISO")[0].trim());
            } else {
                console.error("❌ OpenAI response missing 'recommendations' field:", parsedResponse);
            }
        } catch (parseError) {
            console.error("❌ OpenAI response invalid:", openAIResponse);
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

        // Convert answers into a single string (consistent with how we store it)
        const answerCombination = userAnswers.join(", ");

        // 🔍 **First, check if a recommendation already exists in the database**
        const existingRecommendation = await pool.query(
            `SELECT film_stock_1, film_stock_2, film_stock_3 FROM recommendations WHERE answer_combination = $1`,
            [answerCombination]
        );

        if (existingRecommendation.rows.length > 0) {
            console.log("✅ Returning cached recommendation from database.");
            return res.json(existingRecommendation.rows[0]);
        }

        // Extract and normalize film format
        const filmFormat = formatMap[userAnswers[0]] || userAnswers[0];

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

        let recommendations = await generateRecommendationsWithOpenAI(filmStocks, userAnswers);
        if (recommendations.length === 0) {
            console.log("⚠️ OpenAI failed—defaulting to first 3 film stocks.");
            recommendations = filmStocks.slice(0, 3).map(f => f.name);
        }
        console.log("✅ Final recommendations:", recommendations);

        if (recommendations.length === 0) {
            return res.status(404).json({ error: "No recommendations available" });
        }

        // ✅ FIX: Prevent SQL error when OpenAI fails
        const debugQuery = `SELECT id, name FROM film_stocks WHERE LOWER(name) IN (${recommendations.map((_, i) => `$${i + 1}`).join(", ")})`;
        console.log(`🔍 Debugging film stock lookup query:`, debugQuery, recommendations.map(name => name.toLowerCase()));

        const filmStockResult = await pool.query(debugQuery, recommendations.map(name => name.toLowerCase()));
        console.log(`✅ Found film stock IDs:`, filmStockResult.rows);


        const filmStockMap: Record<string, number> = {};
        filmStockResult.rows.forEach((row: { id: number; name: string }) => {
            filmStockMap[row.name.toLowerCase()] = row.id;
        });

        const film_stock_1 = filmStockMap[recommendations[0]?.toLowerCase()] ?? null;
        const film_stock_2 = filmStockMap[recommendations[1]?.toLowerCase()] ?? null;
        const film_stock_3 = filmStockMap[recommendations[2]?.toLowerCase()] ?? null;

        // ✅ Save to the recommendations table for future use
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

