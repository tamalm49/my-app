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

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Optionally, you can exit the process or perform other cleanup actions here

});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  // Optionally, you can exit the process or perform other cleanup actions here
});
process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    disconnect().then(() => {
      logger.info('Disconnected from services');
    }).catch((error) => {
      logger.error(`Error disconnecting from services: ${error}`);
    });
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    disconnect().then(() => {
      logger.info('Disconnected from services');
    }).catch((error) => {
      logger.error(`Error disconnecting from services: ${error}`);
    });
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
process.on('exit', (code) => {
  logger.info(`Process exiting with code: ${code}`);
});
process.on('warning', (warning) => {
  logger.warn(`Warning: ${warning.name} - ${warning.message}\n${warning.stack}`);
});
