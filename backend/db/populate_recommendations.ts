import fs from "fs";
import path from "path";
import { Pool } from "pg";
import csvParser from "csv-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Define the CSV file path
const csvFilePath = path.join(__dirname, "recommendations.csv");

// Function to import CSV data into PostgreSQL
const populateRecommendations = async () => {
    try {
        console.log("🌱 Populating recommendations table...");

        const recommendations: any[] = [];

        // Read and parse the CSV file
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on("data", (row) => {
                recommendations.push(row);
            })
            .on("end", async () => {
                // Insert recommendations into the table
                for (const recommendation of recommendations) {
                    const { answer_combination, film_stock_1, film_stock_2, film_stock_3 } = recommendation;

                    await pool.query(`
                        INSERT INTO recommendations (answer_combination, film_stock_1, film_stock_2, film_stock_3) 
                        VALUES ($1, $2, $3, $4)
                    `, [
                        answer_combination,
                        parseInt(film_stock_1),
                        parseInt(film_stock_2),
                        parseInt(film_stock_3)
                    ]);
                }

                console.log("✅ Recommendations table populated successfully!");
                pool.end();
            });
    } catch (err) {
        console.error("❌ Error populating recommendations table", err);
        pool.end();
    }
};

// Execute the function
populateRecommendations();
