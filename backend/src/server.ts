import app from "./app";
import { env } from "./config/env";
import pool from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

