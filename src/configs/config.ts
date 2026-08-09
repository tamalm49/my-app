export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
};

export const corsOptions = {
  origin: config.nodeEnv === "production" ? "https://your-production-domain.com" : "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  headers: "Content-Type, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};