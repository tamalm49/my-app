import { createServer } from 'node:http';
import app from './app.js';
import { config } from './configs/config.js';
import { logger } from './utils/logger.js';
import { connect, disconnect } from './configs/connections.js';

const port = config.port;

const server = createServer(app);

server.listen(port, () => {
  connect().then(() => {
    logger.info('Connected to services');
  }).catch((error) => {
    logger.error(`Error connecting to services: ${error}`);
  });
  logger.info(`Server running on http://localhost:${port}`);
});
function gracefulShutdown(signal?: string) {
  logger.info(`Received shutdown ${signal || 'unknown'}, closing server..`);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.close(async () => {
    try {
      await disconnect();
      logger.info('Server closed');
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown: ${error}`);
      process.exit(1);
    }
  });
  // force exit if cleanup hangs
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Optionally, you can exit the process or perform other cleanup actions here

});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  // Optionally, you can exit the process or perform other cleanup actions here
});
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('exit', (code) => {
  logger.info(`Process exiting with code: ${code}`);
});
process.on('warning', (warning) => {
  logger.warn(`Warning: ${warning.name} - ${warning.message}\n${warning.stack}`);
});
