import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import nodeCron from "node-cron";
import { TIME_ZONE_JAKARTA_INDONESIA, TWO_AM_EVERY_SUNDAY } from "../constant";
import { executeQuery } from "../core/utils/query/query";

function plugin(app: FastifyInstance) {
  const task = nodeCron.schedule(
    TWO_AM_EVERY_SUNDAY,
    async () => {
      try {
        app.log.info("[__CRON] Running revoked tokens clean up");

        const cleanedRows =
          await executeQuery(`DELETE FROM revoked_tokens WHERE id IN (
            SELECT id FROM revoked_tokens WHERE revoke_reason IN ('rotated', 'logout', 'refreshed')
            ORDER BY revoked_at ASC LIMIT 500 
        )`);

        app.log.info(
          `[__CRON] Cleaned revoked tokens rows: ${cleanedRows.rowCount}`,
        );
      } catch (error) {
        app.log.error(error, `[__CRON] Failed cleaning revoked tokens`);
      }
    },
    { timezone: TIME_ZONE_JAKARTA_INDONESIA },
  ); // AUTO START AT 2 AM EVERY SUNDAY

  app.addHook("onClose", async () => {
    task.stop();
  });
}

export default fp(plugin);
