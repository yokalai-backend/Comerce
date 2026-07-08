import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import nodeCron from "node-cron";
import { TIME_ZONE_JAKARTA_INDONESIA, TWO_AM_EVERY_SUNDAY } from "../constant";
import { executeQuery } from "../core/utils/query/query";

function plugin(f: FastifyInstance) {
  const revokedTokensCleanUp = nodeCron.schedule(
    TWO_AM_EVERY_SUNDAY,
    async () => {
      try {
        f.log.info("[__CRON] Running revoked tokens clean up");

        const cleanedRows =
          await executeQuery(`DELETE FROM revoked_tokens WHERE id IN (
            SELECT id FROM revoked_tokens WHERE revoke_reason IN ('rotated', 'logout', 'refreshed')
            ORDER BY revoked_at ASC LIMIT 500 
        )`);

        f.log.info(
          `[__CRON] Total cleaned revoked tokens: ${cleanedRows.rowCount}`,
        );
      } catch (error) {
        f.log.error(error, `[__CRON] Failed cleaning revoked tokens`);
      }
    },
    { timezone: TIME_ZONE_JAKARTA_INDONESIA },
  ); // AUTO START AT 2 AM EVERY SUNDAY

  const connectedDevicesCleanUp = nodeCron.schedule(
    TWO_AM_EVERY_SUNDAY,
    async () => {
      try {
        f.log.info("[__CRON] Running connected devices clean up");

        const cleanedRows = await executeQuery(`
            DELETE FROM devices WHERE id IN (
            SELECT id FROM devices WHERE created_at < NOW() - INTERVAL '30 days' 
            ORDER BY created_at ASC
          )`);

        f.log.info(
          `[__CRON] Total cleaned connected devices rows: ${cleanedRows.rowCount}`,
        );
      } catch (error) {
        f.log.error(error, `[__CRON] Failed cleaning connected devices`);
      }
    },
    { timezone: TIME_ZONE_JAKARTA_INDONESIA },
  );

  f.addHook("onClose", async () => {
    revokedTokensCleanUp.stop();
    connectedDevicesCleanUp.stop();
  });
}

export default fp(plugin);
