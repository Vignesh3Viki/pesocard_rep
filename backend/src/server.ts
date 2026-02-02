
import app from "./app.js";
import { env } from "./config/env.js";
import pool from "./config/db.js";
import fs from "fs";
import https from "https";
import http from "http";

const PORT = process.env.PORT || 3000;
const SSL_KEY_PATH = "/etc/ssl/pesocard/privkey.pem";
const SSL_CERT_PATH = "/etc/ssl/pesocard/cert.pem";
const SSL_CA_PATH = "/etc/ssl/pesocard/chain.pem";


const startServer = async () => {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");

    let server;
    if (
      fs.existsSync(SSL_KEY_PATH) &&
      fs.existsSync(SSL_CERT_PATH) &&
      fs.existsSync(SSL_CA_PATH)
    ) {
      const sslOptions = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
        ca: fs.readFileSync(SSL_CA_PATH),
      };
      server = https.createServer(sslOptions, app);
      server.listen(PORT, () => {
        console.log(
          `🔒 HTTPS server running in ${env.NODE_ENV} mode on port ${PORT}`
        );
      });
    } else {
      server = http.createServer(app);
      server.listen(PORT, () => {
        console.log(
          `🚀 HTTP server running in ${env.NODE_ENV} mode on port ${PORT}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

