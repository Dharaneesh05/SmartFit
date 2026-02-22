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
  type InsertNotification,
  type LoginData
} from "@shared/schema";
import { MongoStorage } from "./mongodb-storage";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Measurement methods
  getMeasurement(userId: string): Promise<Measurement | undefined>;
  createOrUpdateMeasurement(userId: string, measurement: InsertMeasurement): Promise<Measurement>;
  
  // Product methods
  createProduct(userId: string, product: InsertProduct): Promise<Product>;
  getProduct(id: string): Promise<Product | undefined>;
  getUserProducts(userId: string): Promise<Product[]>;
  
  // Fit Analysis methods
  createFitAnalysis(userId: string, productId: string, fitStatus: string, analysis: any, recommendations?: string): Promise<FitAnalysis>;
  getUserFitAnalyses(userId: string): Promise<FitAnalysis[]>;
  
  // Favorites methods
  addToFavorites(userId: string, productId: string): Promise<Favorite>;
  removeFromFavorites(userId: string, productId: string): Promise<void>;
  getUserFavorites(userId: string): Promise<(Favorite & { product: Product })[]>;
  
  // Recommendations methods
  createRecommendation(userId: string, recommendation: InsertRecommendation): Promise<Recommendation>;
  getUserRecommendations(userId: string): Promise<Recommendation[]>;
  
  // History methods
  addToHistory(userId: string, history: InsertHistory): Promise<UserHistory>;
  getUserHistory(userId: string): Promise<UserHistory[]>;
  
  // Notifications methods
  createNotification(userId: string, notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(notificationId: string): Promise<void>;
}

// Create MongoDB storage instance
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartfit';
export const storage = new MongoStorage(mongoUri);
