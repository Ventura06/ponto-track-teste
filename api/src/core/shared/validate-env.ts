import { z } from 'zod';

export const envSchema = z
  .object({
    DB_TYPE: z.enum(['postgres', 'mysql', 'mariadb', 'sqlite', 'mssql']),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
  })
  .required();

export const validatedEnv = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
};
