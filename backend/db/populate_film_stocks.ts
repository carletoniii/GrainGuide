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
const csvFilePath = path.join(__dirname, "film_stocks.csv");

const populateDatabase = async () => {
    try {
        console.log("🌱 Populating GrainGuide database...");

        // Read and parse the CSV file
        const filmStocks: any[] = [];

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on("data", (row) => {
                // Store the row data from CSV
                filmStocks.push(row);
            })
            .on("end", async () => {
                console.log(`📂 Read ${filmStocks.length} film stocks from CSV. Importing into database...`);

                // Loop through the film stocks array and insert into the database
                for (const stock of filmStocks) {
                    await pool.query(
                        `INSERT INTO film_stocks (name, brand, format, iso, color, contrast, grain, description, image_url, example_images)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (name) DO NOTHING;`,
                        [
                            stock.name,
                            stock.brand,
                            stock.format,
                            parseInt(stock.iso),
                            stock.color.toLowerCase() === "true",
                            stock.contrast.toLowerCase(),
                            stock.grain.toLowerCase(),
                            stock.description,
                            stock.image_url || null,
                            stock.example_images || null,
                        ]
                    );
                }

                console.log("✅ Database populated successfully!");
                pool.end();
            });
    } catch (err) {
        console.error("❌ Error populating database", err);
        pool.end();
    }
};

// Run the function
populateDatabase();
