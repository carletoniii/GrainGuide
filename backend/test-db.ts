import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const testConnection = async () => {
    try {
        const res = await pool.query("SELECT NOW();");
        console.log("✅ Database connected successfully! Current time:", res.rows[0].now);
    } catch (err) {
        console.error("❌ Database connection error:", err);
    } finally {
        pool.end();
    }
};

// Run the connection test
testConnection();
