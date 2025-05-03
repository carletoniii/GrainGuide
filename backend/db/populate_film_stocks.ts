import fs from "fs";
import path from "path";
import { Pool } from "pg";
import csvParser from "csv-parser";
import dotenv from "dotenv";

// ✅ Explicitly load the .env file from the backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ PostgreSQL connection
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

        fs.createReadStream(csvFilePath, { encoding: 'utf8' })
            .pipe(csvParser())
            .on("data", (row) => {
                // ✅ Ensure 'format' is properly converted into an array
                const formatArray = row.format
                    .replace(/^{/, '')    // Remove leading {
                    .replace(/}$/, '')    // Remove trailing }
                    .split(',')
                    .map((item: string) => item.trim().replace(/^"|"$/g, '')); // Remove unnecessary quotes

                // Store the row data from CSV
                filmStocks.push({
                    name: row.name,
                    brand: row.brand,
                    format: formatArray,  // ✅ Ensure it's an array
                    iso: parseInt(row.iso),
                    color: row.color.toLowerCase() === "true",
                    contrast: row.contrast.toLowerCase(),
                    grain: row.grain.toLowerCase(),
                    description: row.description,
                    image_url: row.image_url || null,
                    example_images: row.example_images || null,
                });
            })
            .on("end", async () => {
                console.log(`📂 Read ${filmStocks.length} film stocks from CSV. Importing into database...`);

                // Loop through the film stocks array and insert into the database
                for (const stock of filmStocks) {
                    await pool.query(
                        `INSERT INTO film_stocks (name, brand, format, iso, color, contrast, grain, description, image_url, example_images)
                        VALUES ($1, $2, $3::TEXT[], $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (name) DO NOTHING;`,
                        [
                            stock.name,
                            stock.brand,
                            stock.format,  // ✅ Insert as proper array
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
