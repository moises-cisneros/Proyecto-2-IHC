import express, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./lib/config.js";
import { authRouter } from "./routes/auth.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ message: "JSON inválido" });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
  });

  return app;
}
