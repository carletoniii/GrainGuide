import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS film_stocks (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        brand TEXT NOT NULL,
        format TEXT[] NOT NULL,  -- Define as array of text
        iso INTEGER NOT NULL,
        color BOOLEAN NOT NULL,
        contrast TEXT CHECK (contrast IN ('low', 'medium', 'high')),
        grain TEXT CHECK (grain IN ('fine', 'medium', 'heavy', 'ultra fine', 'variable')),
        description TEXT,
        image_url TEXT,
        example_images TEXT
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        answer_combination TEXT UNIQUE NOT NULL,
        film_stock_1 INTEGER REFERENCES film_stocks(id) ON DELETE CASCADE,
        film_stock_2 INTEGER REFERENCES film_stocks(id) ON DELETE CASCADE,
        film_stock_3 INTEGER REFERENCES film_stocks(id) ON DELETE CASCADE
      );
    `);

        console.log("✅ Database tables created successfully!");
    } catch (err) {
        console.error("❌ Error creating tables", err);
    } finally {
        pool.end();
    }
};

// Run the migration script
createTables();
