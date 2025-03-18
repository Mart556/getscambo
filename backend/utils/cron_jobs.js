import cron from "node-cron";
import pool from "./db.js";

const initCronJobs = () => {
    // Reset the leaderboard every Sunday at midnight
    cron.schedule("0 0 * * 0", async () => {
        try {
            await pool.query("DELETE FROM `leaderboard`");
            console.log("Leaderboard reset at", new Date().toISOString());
        } catch (error) {
            console.error("Error resetting leaderboard:", error);
        }
    });

    console.log("Scheduled tasks initialized");
};

export default initCronJobs;
