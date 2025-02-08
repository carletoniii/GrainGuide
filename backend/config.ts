import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const DEBUG_MODE = process.env.DEBUG === "true";

if (!DATABASE_URL || !OPENAI_API_KEY) {
    throw new Error("Missing required environment variables.");
}
