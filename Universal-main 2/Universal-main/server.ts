import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (Mock Auth for Design)
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    // Simple mock auth for demonstration
    if (username === "admin" && password === "admin123") {
      return res.json({
        success: true,
        user: {
          uid: "MOCK_ADMIN",
          username: "admin",
          displayName: "System Administrator",
          role: "admin"
        }
      });
    }
    
    res.status(401).json({ error: "Invalid credentials" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
