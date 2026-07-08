import { config } from "dotenv";
import { z } from "zod";
config();

const env = z.object({
  DB_USERNAME: z.string(),
  DB_HOST: z.string(),
  DB_PASSWORD: z.string(),
  DATABASE: z.string(),
  DB_PORT: z.coerce.number(),
  ACCESS_TOKEN: z.string(),
  INTERNAL_KEY: z.string(),
  AMQP_URL: z.string(),
});

export default env.parse(process.env);
