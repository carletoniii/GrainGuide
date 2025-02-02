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

// Function to import CSV data into PostgreSQL
const importCSV = async () => {
    try {
        const filmStocks: any[] = [];

        // Read and parse the CSV file
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on("data", (row) => {
                filmStocks.push({
                    name: row.name.trim(),
                    brand: row.brand.trim(),
                    format: row.format.trim(),
                    iso: parseInt(row.iso) || null,
                    color: (row.color || "").toLowerCase() === "true",
                    contrast: (row.contrast || "").toLowerCase(),
                    grain: (row.grain || "").toLowerCase(),
                    description: row.description ? row.description.trim() : null,
                    image_url: row.image_url || null,
                    example_images: row.example_images || null
                });
            })
            .on("end", async () => {
                console.log(`📂 Found ${filmStocks.length} film stocks in CSV. Importing...`);

                for (const stock of filmStocks) {
                    await pool.query(
                        `INSERT INTO film_stocks (name, brand, format, iso, color, contrast, grain, description, image_url, example_images)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (name) DO NOTHING;`,
                        [
                            stock.name,
                            stock.brand,
                            stock.format,
                            stock.iso,
                            stock.color,
                            stock.contrast,
                            stock.grain,
                            stock.description,
                            stock.image_url,
                            stock.example_images,
                        ]
                    );
                }

                console.log(`✅ Successfully imported ${filmStocks.length} film stocks into the database.`);
                pool.end();
            });
    } catch (err) {
        console.error("❌ Error importing CSV data", err);
        pool.end();
    }
};

// Run the import function
importCSV();
