import { Pool} from "pg"
import config from "../config"

export type UserRole = "contributor" | "maintainer";
export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";


export const pool = new Pool({
  connectionString: config.database_url,
  ssl: {
    rejectUnauthorized: false,
  },
});




// Create tables
export const initDB = async () => {
  try{
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'contributor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (role IN ('contributor', 'maintainer'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(30) NOT NULL,
      status VARCHAR(30) DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (type IN ('bug', 'feature_request')),
      CHECK (status IN ('open', 'in_progress', 'resolved')),
      CHECK (char_length(description) >= 20)
    );
  `);
  console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
 
    






