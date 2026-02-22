#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartfit';
const client = new MongoClient(MONGO_URI);

// Sample data migration script
async function migrateData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Create collections and indexes
    await db.createCollection('users');
    await db.createCollection('measurements');
    await db.createCollection('products');
    await db.createCollection('fitAnalyses');
    await db.createCollection('favorites');
    await db.createCollection('recommendations');
    await db.createCollection('userHistory');
    await db.createCollection('notifications');
    
    console.log('Collections created successfully');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('measurements').createIndex({ userId: 1 });
    await db.collection('products').createIndex({ userId: 1 });
    await db.collection('fitAnalyses').createIndex({ userId: 1 });
    await db.collection('favorites').createIndex({ userId: 1, productId: 1 }, { unique: true });
    
    console.log('Indexes created successfully');
    
    // Sample data insertion
    const sampleUsers = [
      {
        username: 'demo_user',
        email: 'demo@example.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash of 'password'
        fullName: 'Demo User',
        createdAt: new Date()
      }
    ];
    
    const users = db.collection('users');
    const result = await users.insertMany(sampleUsers);
    console.log(`Inserted ${result.insertedCount} sample users`);
    
    console.log('Data migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateData().catch(console.error);
