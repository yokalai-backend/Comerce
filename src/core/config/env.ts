import { config } from "dotenv";
config();
import { z } from "zod";

const env = z.object({
  DB_USERNAME: z.string(),
  DB_HOST: z.string(),
  DB_PASSWORD: z.string(),
  DATABASE: z.string(),
  DB_PORT: z.coerce.number(),
  ACCESS_TOKEN: z.string(),
  REFRESH_TOKEN: z.string(),
});

export default env.parse(process.env);
