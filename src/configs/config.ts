export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: String(process.env.NODE_ENV).trim(),
  openAiApiKey: String(process.env.OPENAI_API_KEY).trim()
};

export const corsOptions = {
  origin: config.nodeEnv === 'production' ? 'https://your-production-domain.com' : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export const mongoConfig = {
  uri: String(process.env.MONGO_URI).trim() || 'mongodb://localhost:27017/your-database-name',
  schema: String(process.env.MONGO_SCHEMA).trim() || 'my-app-schema'
};
export const redisConfig = {
  host: String(process.env.VALKEY_URL).trim() || 'localhost',
  port: 6379
};