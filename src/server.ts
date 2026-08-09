import { createServer } from "node:http";
import app from "./app.js";
import { config } from "./configs/config.js";
import { logger } from "./utils/logger.js";

const port = config.port;

const server = createServer(app);

server.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});