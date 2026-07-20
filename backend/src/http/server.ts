import express, { type Application } from "express";

import { accountsRouter } from "./routes/accounts.routes";
import { refreshRouter } from "./routes/refresh.routes";
import { mailRouter } from "./routes/email.routes";
import { authRouter } from "./routes/auth.routes";

export function createServer(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("Maily API is running!");
  });

  app.use("/", accountsRouter);
  app.use("/", refreshRouter);
  app.use("/", authRouter);
  app.use("/", mailRouter);


  return app;
}
