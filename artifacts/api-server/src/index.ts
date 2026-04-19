import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

async function syncSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_pengiriman TEXT NOT NULL DEFAULT 'Menunggu';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS driver_name TEXT;
    `);
    logger.info("DB schema sync complete");
  } catch (err) {
    logger.error({ err }, "DB schema sync failed");
  } finally {
    client.release();
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

syncSchema().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});
