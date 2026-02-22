import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, measurementSchema, productSchema, type User } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express"; // Added

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authenticateToken = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({ ...userData, password: hashedPassword });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }, token });
    } catch (error) {
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const loginData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(loginData.password, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }, token });
    } catch (error) {
      res.status(400).json({ message: 'Invalid login data' });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ id: user.id, username: user.username, email: user.email, fullName: user.fullName });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get("/api/measurements", authenticateToken, async (req: Request, res: Response) => {
    try {
      const measurement = await storage.getMeasurement(req.userId!);
      res.json(measurement);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/measurements", authenticateToken, async (req: Request, res: Response) => {
    try {
      const measurementData = measurementSchema.parse(req.body);
      const measurement = await storage.createOrUpdateMeasurement(req.userId!, measurementData);
      res.json(measurement);
    } catch (error) {
      res.status(400).json({ message: 'Invalid measurement data' });
    }
  });

  app.post("/api/products", authenticateToken, async (req: Request, res: Response) => {
    try {
      const productData = productSchema.parse(req.body);
      const product = await storage.createProduct(req.userId!, productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: 'Invalid product data' });
    }
  });

  app.get("/api/products/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post("/api/fit-predict", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      const product = await storage.getProduct(productId);
      const measurement = await storage.getMeasurement(req.userId!);

      if (!product || !measurement) return res.status(400).json({ message: 'Product or measurements not found' });

      const predictions: any = {};
      let overallFit = 'perfect';
      const recommendations: string[] = [];

      if (product.measurements) {
        if (measurement.chest && product.measurements.chest) {
          const diff = Math.abs(measurement.chest - product.measurements.chest);
          if (diff > 4) {
            predictions.chest = measurement.chest > product.measurements.chest ? 'too_small' : 'too_large';
            overallFit = 'poor';
            recommendations.push(`Chest: ${predictions.chest === 'too_small' ? 'Consider larger size' : 'Consider smaller size'}`);
          } else if (diff > 2) {
            predictions.chest = 'tight';
            if (overallFit === 'perfect') overallFit = 'acceptable';
          } else {
            predictions.chest = 'perfect';
          }
        }
        if (measurement.shoulders && product.measurements.shoulders) {
          const diff = Math.abs(measurement.shoulders - product.measurements.shoulders);
          if (diff > 3) {
            predictions.shoulders = measurement.shoulders > product.measurements.shoulders ? 'too_small' : 'too_large';
            overallFit = 'poor';
            recommendations.push(`Shoulders: ${predictions.shoulders === 'too_small' ? 'Consider larger size' : 'Consider smaller size'}`);
          } else {
            predictions.shoulders = 'good';
          }
        }
      }

      const fitStatus = overallFit === 'perfect' ? 'perfect' : overallFit === 'acceptable' ? 'acceptable' : 'poor';
      const analysis = await storage.createFitAnalysis(
        req.userId!,
        productId,
        fitStatus,
        { predictions, measurements: { user: measurement, product: product.measurements } },
        recommendations.join('; ')
      );

      res.json({
        fitStatus,
        analysis: analysis.analysis,
        recommendations: analysis.recommendations,
        id: analysis.id
      });
    } catch (error) {
      res.status(400).json({ message: 'Fit prediction failed' });
    }
  });

  app.post("/api/favorites", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      const favorite = await storage.addToFavorites(req.userId!, productId);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: 'Failed to add favorite' });
    }
  });

  app.delete("/api/favorites/:productId", authenticateToken, async (req: Request, res: Response) => {
    try {
      await storage.removeFromFavorites(req.userId!, req.params.productId);
      res.json({ message: 'Removed from favorites' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to remove favorite' });
    }
  });

  app.get("/api/favorites", authenticateToken, async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getUserFavorites(req.userId!);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get("/api/fit-analyses", authenticateToken, async (req: Request, res: Response) => {
    try {
      const analyses = await storage.getUserFitAnalyses(req.userId!);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get("/api/recommendations", authenticateToken, async (req: Request, res: Response) => {
    try {
      const recommendations = await storage.getUserRecommendations(req.userId!);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get recommendations' });
    }
  });

  app.post("/api/recommendations", authenticateToken, async (req: Request, res: Response) => {
    try {
      const recommendation = await storage.createRecommendation(req.userId!, req.body);
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create recommendation' });
    }
  });

  app.get("/api/history", authenticateToken, async (req: Request, res: Response) => {
    try {
      const history = await storage.getUserHistory(req.userId!);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get history' });
    }
  });

  app.post("/api/history", authenticateToken, async (req: Request, res: Response) => {
    try {
      const historyEntry = await storage.addToHistory(req.userId!, req.body);
      res.json(historyEntry);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add to history' });
    }
  });

  app.get("/api/notifications", authenticateToken, async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getUserNotifications(req.userId!);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get notifications' });
    }
  });

  app.patch("/api/notifications/:id/read", authenticateToken, async (req: Request, res: Response) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
