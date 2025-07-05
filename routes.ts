import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScreenTimeSessionSchema, insertDailyGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get screen time sessions for current user (using userId 1 for demo)
  app.get("/api/screen-time-sessions", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const sessions = await storage.getScreenTimeSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch screen time sessions" });
    }
  });

  // Get screen time sessions for a specific date
  app.get("/api/screen-time-sessions/:date", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const { date } = req.params;
      const sessions = await storage.getScreenTimeSessionsByDate(userId, date);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch screen time sessions for date" });
    }
  });

  // Create a new screen time session
  app.post("/api/screen-time-sessions", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const sessionData = insertScreenTimeSessionSchema.parse({
        ...req.body,
        userId
      });
      const session = await storage.createScreenTimeSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create screen time session" });
      }
    }
  });

  // Delete a screen time session
  app.delete("/api/screen-time-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      await storage.deleteScreenTimeSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete screen time session" });
    }
  });

  // Get daily goal for current user
  app.get("/api/daily-goal", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const goal = await storage.getDailyGoal(userId);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily goal" });
    }
  });

  // Create or update daily goal
  app.post("/api/daily-goal", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const goalData = insertDailyGoalSchema.parse({
        ...req.body,
        userId
      });
      const goal = await storage.createOrUpdateDailyGoal(goalData);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid goal data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create or update daily goal" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
