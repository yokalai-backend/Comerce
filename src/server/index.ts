import { FastifyInstance } from "fastify";
import buildApp from "./app";

async function index() {
  let app: FastifyInstance | undefined;

  try {
    app = await buildApp();

    await app.listen({ port: 5002, host: "0.0.0.0" });

    app.log.info("Auth service started on port 5002");
  } catch (error) {
    app?.log.error(error);

    process.exit(1);
  }
}

index();
