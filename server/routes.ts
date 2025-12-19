import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPracticeSessionSchema, insertGoalsSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/sessions", async (req, res) => {
    const sessions = await storage.getSessions();
    res.json(sessions);
  });

  app.get("/api/sessions/:id", async (req, res) => {
    const session = await storage.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  });

  app.post("/api/sessions", async (req, res) => {
    const result = insertPracticeSessionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const session = await storage.createSession(result.data);
    res.status(201).json(session);
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    const result = insertPracticeSessionSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const session = await storage.updateSession(req.params.id, result.data);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    const deleted = await storage.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(204).send();
  });

  app.get("/api/goals", async (req, res) => {
    const goals = await storage.getGoals();
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    const result = insertGoalsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const goals = await storage.setGoals(result.data);
    res.json(goals);
  });

  return httpServer;
}
