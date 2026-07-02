import { FastifyInstance } from "fastify";

export default function productsRoute(app: FastifyInstance) {
  app.get("/ping", async (req, rep) => {
    console.log("Requested");

    console.log(req.headers);

    rep.code(200).send({ ping: "HELLO" });
  });
}
