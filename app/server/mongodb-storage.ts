import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { 
  type User, 
  type InsertUser, 
  type Measurement, 
  type InsertMeasurement,
  type Product,
  type InsertProduct,
  type FitAnalysis,
  type Favorite,
  type Recommendation,
  type InsertRecommendation,
  type UserHistory,
  type InsertHistory,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import bcrypt from "bcrypt";

export class MongoStorage {
  private client: MongoClient;
  private db: Db;
  private users: Collection;
  private measurements: Collection;
  private products: Collection;
  private fitAnalyses: Collection;
  private favorites: Collection;
  private recommendations: Collection;
  private userHistory: Collection;
  private notifications: Collection;

  constructor(mongoUri: string = 'mongodb://localhost:27017/smartfit') {
    this.client = new MongoClient(mongoUri);
    this.db = this.client.db();
    this.users = this.db.collection('users');
    this.measurements = this.db.collection('measurements');
    this.products = this.db.collection('products');
    this.fitAnalyses = this.db.collection('fitAnalyses');
    this.favorites = this.db.collection('favorites');
    this.recommendations = this.db.collection('recommendations');
    this.userHistory = this.db.collection('userHistory');
    this.notifications = this.db.collection('notifications');
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
      
      // Create indexes
      await this.users.createIndex({ email: 1 }, { unique: true });
      await this.users.createIndex({ username: 1 }, { unique: true });
      await this.measurements.createIndex({ userId: 1 });
      await this.products.createIndex({ userId: 1 });
      await this.fitAnalyses.createIndex({ userId: 1 });
      await this.fitAnalyses.createIndex({ productId: 1 });
      await this.favorites.createIndex({ userId: 1, productId: 1 }, { unique: true });
      await this.recommendations.createIndex({ userId: 1 });
      await this.userHistory.createIndex({ userId: 1 });
      await this.notifications.createIndex({ userId: 1 });
      
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.client.close();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await this.users.findOne({ _id: new ObjectId(id) });
      if (!user) return undefined;
      
      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) return undefined;
      
      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await this.users.findOne({ username });
      if (!user) return undefined;
      
      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      const result = await this.users.insertOne({
        username: insertUser.username,
        email: insertUser.email,
        password: hashedPassword,
        fullName: insertUser.fullName,
        createdAt: new Date()
      });
      
      const user = await this.users.findOne({ _id: result.insertedId });
      return {
        id: user!._id.toString(),
        username: user!.username,
        email: user!.email,
        password: user!.password,
        fullName: user!.fullName,
        createdAt: user!.createdAt
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Measurement methods
  async getMeasurement(userId: string): Promise<Measurement | undefined> {
    try {
      const measurement = await this.measurements.findOne({ userId });
      if (!measurement) return undefined;
      
      return {
        id: measurement._id.toString(),
        userId: measurement.userId,
        chest: measurement.chest,
        shoulders: measurement.shoulders,
        waist: measurement.waist,
        height: measurement.height,
        hips: measurement.hips,
        confidence: measurement.confidence,
        createdAt: measurement.createdAt,
        updatedAt: measurement.updatedAt
      };
    } catch (error) {
      console.error('Error getting measurement:', error);
      return undefined;
    }
  }

  async createOrUpdateMeasurement(userId: string, measurement: InsertMeasurement): Promise<Measurement> {
    try {
      const existing = await this.measurements.findOne({ userId });
      const now = new Date();
      
      const measurementData = {
        userId,
        chest: measurement.chest || null,
        shoulders: measurement.shoulders || null,
        waist: measurement.waist || null,
        height: measurement.height || null,
        hips: measurement.hips || null,
        confidence: measurement.confidence || null,
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };
      
      if (existing) {
        await this.measurements.updateOne(
          { _id: existing._id },
          { $set: measurementData }
        );
        
        const updated = await this.measurements.findOne({ _id: existing._id });
        return {
          id: updated!._id.toString(),
          ...measurementData
        };
      } else {
        const result = await this.measurements.insertOne(measurementData);
        const created = await this.measurements.findOne({ _id: result.insertedId });
        return {
          id: created!._id.toString(),
          ...measurementData
        };
      }
    } catch (error) {
      console.error('Error creating/updating measurement:', error);
      throw error;
    }
  }

  // Product methods
  async createProduct(userId: string, product: InsertProduct): Promise<Product> {
    try {
      const result = await this.products.insertOne({
        userId,
        name: product.name,
        brand: product.brand || null,
        imageUrl: product.imageUrl || null,
        description: product.description || null,
        size: product.size || null,
        measurements: product.measurements || null,
        createdAt: new Date()
      });
      
      const created = await this.products.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        name: created!.name,
        brand: created!.brand,
        imageUrl: created!.imageUrl,
        description: created!.description,
        size: created!.size,
        measurements: created!.measurements,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const product = await this.products.findOne({ _id: new ObjectId(id) });
      if (!product) return undefined;
      
      return {
        id: product._id.toString(),
        userId: product.userId,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        description: product.description,
        size: product.size,
        measurements: product.measurements,
        createdAt: product.createdAt
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return undefined;
    }
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    try {
      const products = await this.products.find({ userId }).toArray();
      return products.map(product => ({
        id: product._id.toString(),
        userId: product.userId,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        description: product.description,
        size: product.size,
        measurements: product.measurements,
        createdAt: product.createdAt
      }));
    } catch (error) {
      console.error('Error getting user products:', error);
      return [];
    }
  }

  // Fit Analysis methods
  async createFitAnalysis(userId: string, productId: string, fitStatus: string, analysis: any, recommendations?: string): Promise<FitAnalysis> {
    try {
      const result = await this.fitAnalyses.insertOne({
        userId,
        productId,
        fitStatus,
        analysis,
        recommendations: recommendations || null,
        createdAt: new Date()
      });
      
      const created = await this.fitAnalyses.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        productId: created!.productId,
        fitStatus: created!.fitStatus,
        analysis: created!.analysis,
        recommendations: created!.recommendations,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error creating fit analysis:', error);
      throw error;
    }
  }

  async getUserFitAnalyses(userId: string): Promise<FitAnalysis[]> {
    try {
      const analyses = await this.fitAnalyses
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return analyses.map(analysis => ({
        id: analysis._id.toString(),
        userId: analysis.userId,
        productId: analysis.productId,
        fitStatus: analysis.fitStatus,
        analysis: analysis.analysis,
        recommendations: analysis.recommendations,
        createdAt: analysis.createdAt
      }));
    } catch (error) {
      console.error('Error getting user fit analyses:', error);
      return [];
    }
  }

  // Favorites methods
  async addToFavorites(userId: string, productId: string): Promise<Favorite> {
    try {
      const result = await this.favorites.insertOne({
        userId,
        productId,
        createdAt: new Date()
      });
      
      const created = await this.favorites.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        productId: created!.productId,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    try {
      await this.favorites.deleteOne({ userId, productId });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<(Favorite & { product: Product })[]> {
    try {
      const favorites = await this.favorites.find({ userId }).toArray();
      const results = [];
      
      for (const favorite of favorites) {
        const product = await this.getProduct(favorite.productId);
        if (product) {
          results.push({
            id: favorite._id.toString(),
            userId: favorite.userId,
            productId: favorite.productId,
            createdAt: favorite.createdAt,
            product
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  // Recommendations methods
  async createRecommendation(userId: string, recommendation: InsertRecommendation): Promise<Recommendation> {
    try {
      const result = await this.recommendations.insertOne({
        userId,
        productName: recommendation.productName,
        brand: recommendation.brand || null,
        price: recommendation.price || null,
        imageUrl: recommendation.imageUrl || null,
        fitScore: recommendation.fitScore,
        reason: recommendation.reason,
        category: recommendation.category || null,
        size: recommendation.size || null,
        externalUrl: recommendation.externalUrl || null,
        createdAt: new Date()
      });
      
      const created = await this.recommendations.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        productName: created!.productName,
        brand: created!.brand,
        price: created!.price,
        imageUrl: created!.imageUrl,
        fitScore: created!.fitScore,
        reason: created!.reason,
        category: created!.category,
        size: created!.size,
        externalUrl: created!.externalUrl,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error creating recommendation:', error);
      throw error;
    }
  }

  async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const recommendations = await this.recommendations
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return recommendations.map(rec => ({
        id: rec._id.toString(),
        userId: rec.userId,
        productName: rec.productName,
        brand: rec.brand,
        price: rec.price,
        imageUrl: rec.imageUrl,
        fitScore: rec.fitScore,
        reason: rec.reason,
        category: rec.category,
        size: rec.size,
        externalUrl: rec.externalUrl,
        createdAt: rec.createdAt
      }));
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      return [];
    }
  }

  // History methods
  async addToHistory(userId: string, history: InsertHistory): Promise<UserHistory> {
    try {
      const result = await this.userHistory.insertOne({
        userId,
        action: history.action,
        details: history.details || null,
        metadata: history.metadata || null,
        createdAt: new Date()
      });
      
      const created = await this.userHistory.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        action: created!.action,
        details: created!.details,
        metadata: created!.metadata,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }

  async getUserHistory(userId: string): Promise<UserHistory[]> {
    try {
      const history = await this.userHistory
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return history.map(h => ({
        id: h._id.toString(),
        userId: h.userId,
        action: h.action,
        details: h.details,
        metadata: h.metadata,
        createdAt: h.createdAt
      }));
    } catch (error) {
      console.error('Error getting user history:', error);
      return [];
    }
  }

  // Notifications methods
  async createNotification(userId: string, notification: InsertNotification): Promise<Notification> {
    try {
      const result = await this.notifications.insertOne({
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: false,
        actionUrl: notification.actionUrl || null,
        createdAt: new Date()
      });
      
      const created = await this.notifications.findOne({ _id: result.insertedId });
      return {
        id: created!._id.toString(),
        userId: created!.userId,
        title: created!.title,
        message: created!.message,
        type: created!.type,
        isRead: created!.isRead,
        actionUrl: created!.actionUrl,
        createdAt: created!.createdAt
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.notifications
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return notifications.map(n => ({
        id: n._id.toString(),
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        actionUrl: n.actionUrl,
        createdAt: n.createdAt
      }));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.notifications.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
}
