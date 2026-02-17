import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get list of visitors (with optional search)
  app.get(api.visitors.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const visitors = await storage.getVisitors(search, limit);
    res.json(visitors);
  });

  // Get specific visitor
  app.get(api.visitors.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const visitor = await storage.getVisitor(id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.json(visitor);
  });

  // Create visitor
  app.post(api.visitors.create.path, async (req, res) => {
    try {
      const input = api.visitors.create.input.parse(req.body);
      const visitor = await storage.createVisitor(input);
      res.status(201).json(visitor);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Update visitor
  app.put(api.visitors.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.visitors.update.input.parse(req.body);
      const visitor = await storage.updateVisitor(id, input);
      if (!visitor) {
        return res.status(404).json({ message: "Visitor not found" });
      }
      res.json(visitor);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Exit visitor
  app.patch(api.visitors.exit.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const visitor = await storage.exitVisitor(id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.json(visitor);
  });

  // Delete visitor
  app.delete(api.visitors.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteVisitor(id);
    res.status(204).send();
  });

  // Get stats
  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Seed data if empty
  const existingVisitors = await storage.getVisitors();
  if (existingVisitors.length === 0) {
    await storage.createVisitor({
      name: "Ahmet",
      surname: "Yılmaz",
      company: "Tech Corp",
      plate: "34 ABC 123",
      notes: "Toplantı için geldi",
      isInside: true
    });
    await storage.createVisitor({
      name: "Ayşe",
      surname: "Demir",
      company: "Design Studio",
      plate: "06 DEF 456",
      notes: "Teslimat",
      isInside: false
    });
    // Manually mark the second one as exited for demo purposes
    // (In a real app, createVisitor creates it as 'inside' by default)
    const secondVisitor = (await storage.getVisitors("Ayşe"))[0];
    if (secondVisitor) {
      await storage.exitVisitor(secondVisitor.id);
    }
  }

  return httpServer;
}
