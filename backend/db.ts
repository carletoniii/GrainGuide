import { DATABASE_URL } from "./config";  // ✅ Ensure this matches your project structure
import { Pool } from "pg";

export const pool = new Pool({ connectionString: DATABASE_URL });
