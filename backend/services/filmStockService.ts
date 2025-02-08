import { Request, Response } from "express";
import { pool } from "../db";  // ✅ Use correct relative path

export const getFilmStockById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const filmStock = await pool.query(`SELECT * FROM film_stocks WHERE id = $1`, [id]);

        if (filmStock.rows.length === 0) {
            return res.status(404).json({ error: "Film stock not found" });
        }
        return res.json(filmStock.rows[0]); // ✅ Explicit return
    } catch (error) {
        console.error("❌ Error fetching film stock:", error);
        return res.status(500).json({ error: "Error fetching film stock" }); // ✅ Explicit return
    }
};

