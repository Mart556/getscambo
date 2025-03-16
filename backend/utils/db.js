import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connection to the database was successful!");
        connection.release();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

testConnection();

export default pool;
