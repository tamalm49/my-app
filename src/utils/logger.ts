import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';

const logDirectory = path.resolve(process.env.LOG_DIR ?? './var/project-name/log');
const appName = 'my-app';
const logLevel = process.env.LOG_LEVEL ?? 'info';

fs.mkdirSync(logDirectory, { recursive: true });

function buildLogFileName(date = new Date()): string {
  const dateStamp = date.toISOString().slice(0, 10);
  return `${appName}-${dateStamp}.log`;
}

class DailyRotateFileSink {
  write(chunk: string): void {
    const logFilePath = path.join(logDirectory, buildLogFileName());
    fs.mkdirSync(logDirectory, { recursive: true });
    fs.appendFileSync(logFilePath, chunk, 'utf8');
  }
}

const dailyFileStream = new DailyRotateFileSink();

const streams = [
  {
    level: 'info',
    stream: dailyFileStream
  },
  {
    level: 'info',
    stream: process.stdout
  }
];

export const logger = pino(
  {
    name: appName,
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: { level: (label) => ({ level: label }) }
  },
  pino.multistream(streams)
);

export function rotateLogFile(): void {
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentLogFile = path.join(logDirectory, buildLogFileName());
  const expectedLogFile = path.join(logDirectory, `${appName}-${currentDate}.log`);

  if (currentLogFile !== expectedLogFile) {
    logger.flush();
  }
}
