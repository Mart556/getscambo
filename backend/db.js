import mysql from "mysql2";

// Create a connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "getscambo",
});

// Open the MySQL connection
connection.connect((error) => {
    if (error) {
        console.error("Error connecting to the database:", error);
        return;
    }
    console.log("Successfully connected to the database.");
});

export default connection;
