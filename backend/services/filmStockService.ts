// backend/services/filmStockService.ts
import { Request, Response } from "express";
import { pool } from "../db";

// Get a single film stock by ID
export const getFilmStockById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filmStock = await pool.query("SELECT * FROM film_stocks WHERE id = $1", [id]);

        if (filmStock.rows.length === 0) {
            return res.status(404).json({ error: "Film stock not found" });
        }
        return res.json(filmStock.rows[0]);
    } catch (error) {
        console.error("❌ Error fetching film stock:", error);
        return res.status(500).json({ error: "Error fetching film stock" });
    }
};

// ✅ New: Get all film stocks
export const getAllFilmStocks = async (_req: Request, res: Response) => {
    try {
        const allStocks = await pool.query("SELECT * FROM film_stocks ORDER BY name ASC");
        return res.json(allStocks.rows);
    } catch (error) {
        console.error("❌ Error fetching all film stocks:", error);
        return res.status(500).json({ error: "Error fetching film stocks" });
    }
};
