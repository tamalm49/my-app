export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  openAiApiKey: process.env.OPENAI_API_KEY
};

export const corsOptions = {
  origin: config.nodeEnv === 'production' ? 'https://your-production-domain.com' : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export const mongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/your-database-name',
  schema: process.env.MONGO_SCHEMA || 'my-app-schema'
};
export const redisConfig = {
  host: process.env.VALKEY_URL || 'localhost',
  port: 6379
};