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
    const isColor = userAnswers.includes("Color");
    const format = formatMap[userAnswers[0]] || userAnswers[0];

    // Only filter by format and color
    const query = `
        SELECT id, name, format, color, iso, contrast, grain
        FROM film_stocks
        WHERE color = $1
          AND format @> ARRAY[$2]::text[]
    `;
    const params = [isColor, format];
    const result = await pool.query(query, params);

    return result.rows;
};

const generateRecommendationsWithOpenAI = async (filmStocks: { name: string, iso: number, contrast: string, grain: string, color: boolean }[], userAnswers: string[]): Promise<string[]> => {
    try {
        console.log("🧠 Sending request to OpenAI...");

        if (filmStocks.length === 0) {
            console.warn("⚠️ No matching film stocks found. Asking OpenAI for general recommendations.");
            return [];
        }

        const stockList = filmStocks.map((f) =>
            `"${f.name}" (ISO ${f.iso}, ${f.color ? "Color" : "B&W"}, Contrast: ${f.contrast}, Grain: ${f.grain})`
        ).join(", ");

        const userPreferences = userAnswers.slice(1).join(", ");

        const prompt = `You are a film photography expert.

From the list of film stocks: [${stockList}], recommend the top 3 that best match these user preferences:
${userPreferences}

Prioritize ISO suitability and overall match to lighting, subject, and visual style (color vs B&W, contrast, grain, tone).

If no perfect match exists, return the closest alternatives that reflect the user's intent.

Respond only with JSON:
{ "recommendations": ["Film Stock 1", "Film Stock 2", "Film Stock 3"] }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a film photography expert." },
                { role: "user", content: prompt }
            ]
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

        const answerCombination = userAnswers.join(", ");

        const existingRecommendation = await pool.query(
            `SELECT film_stock_1, film_stock_2, film_stock_3 FROM recommendations WHERE answer_combination = $1`,
            [answerCombination]
        );

        if (existingRecommendation.rows.length > 0) {
            console.log("✅ Returning cached recommendation from database.");
            return res.json(existingRecommendation.rows[0]);
        }

        const filmFormat = formatMap[userAnswers[0]] || userAnswers[0];

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

        const filmStocks = await getFilteredFilmStocks(userAnswers);
        console.log(`✅ Retrieved ${filmStocks.length} film stocks after filtering.`);

        let recommendations = await generateRecommendationsWithOpenAI(filmStocks, userAnswers);
        if (recommendations.length === 0) {
            console.log("⚠️ OpenAI failed—defaulting to first 3 film stocks.");
            recommendations = filmStocks.slice(0, 3).map(f => f.name);
        }
        console.log("✅ Final recommendations:", recommendations);

        if (recommendations.length === 0) {
            return res.status(404).json({ error: "No recommendations available" });
        }

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
