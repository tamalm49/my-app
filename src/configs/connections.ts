import mongoose from 'mongoose';
import { mongoConfig } from './config.js';
import { logger } from '../utils/logger.js';
import Redis from "ioredis";
const mongoClient = async () => {
    const connection = await mongoose.connect(mongoConfig.uri + mongoConfig.schema);
    return connection;
}
export const cacheClient = new Redis.Redis({
    host: 'localhost',
    port: 6379,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});
const cacheConnection = async () => {
    try {
        const pong = await cacheClient.ping();
        logger.info(`Connected to Redis: ${pong}`);
    } catch (error) {
        logger.error(`Error connecting to Redis: ${error}`);
    }
}
const disconnectCache = async () => {
    try {
        await cacheClient.quit();
    } catch (error) {
        logger.error(`Error disconnecting from Redis: ${error}`);
    }
}
const disconnectMongo = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        logger.error(`Error disconnecting from MongoDB: ${error}`);
    }
}
export const connect = async () => {
    mongoClient().then((connection) => {
        logger.info(`Connected to MongoDB: ${connection.connection.host}`);
    }).catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error}`);
    });
    await cacheConnection();
}
export const disconnect = async () => {
    await disconnectCache();
    await disconnectMongo();
}
