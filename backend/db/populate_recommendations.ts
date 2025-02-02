import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const populateRecommendations = async () => {
    try {
        console.log("🌱 Populating recommendations table...");

        await pool.query(`
      INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3) 
      VALUES
        ('Daylight,Portraits,35mm,Color,Low ISO,Low Contrast,Fine Grain,Warm,Modern,Sharp', 1, 2, 3),
        ('Low Light,Street Photography,35mm,Black & White,High ISO,High Contrast,Heavy Grain,Cool,Vintage,Dreamy', 7, 6, 5),
        ('Golden Hour,Landscapes,120,Color,Medium ISO,Medium Contrast,Medium Grain,Balanced,Modern,Sharp', 8, 3, 4),
        ('Indoor,Experimental,35mm,Black & White,High ISO,Low Contrast,Fine Grain,Neutral,Doesn’t matter,Sharp', 12, 11, 10);
    `);

        console.log("✅ Recommendations table populated successfully!");
    } catch (err) {
        console.error("❌ Error populating recommendations table", err);
    } finally {
        pool.end();
    }
};

// Run the populate function
populateRecommendations();
