import mongoose from 'mongoose';
import { config } from '../config';

export class Database {
  private static instance: Database;
  private isConnected = false;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true,
      };

      await mongoose.connect(config.mongoUri, options);
      this.isConnected = true;
      console.log('Connected to MongoDB successfully');

      // Handle connection events
      mongoose.connection.on('error', this.handleError);
      mongoose.connection.on('disconnected', this.handleDisconnection);
      mongoose.connection.on('reconnected', this.handleReconnection);

    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
    }
  }

  private handleError = (error: Error) => {
    console.error('MongoDB connection error:', error);
  };

  private handleDisconnection = () => {
    console.log('MongoDB disconnected');
    this.isConnected = false;
  };

  private handleReconnection = () => {
    console.log('MongoDB reconnected');
    this.isConnected = true;
  };

  getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  async healthCheck(): Promise<{ status: string; details?: any }> {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected' };
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      
      const stats = await mongoose.connection.db.stats();
      
      return {
        status: 'connected',
        details: {
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          collections: stats.collections,
          dataSize: stats.dataSize,
          indexes: stats.indexes
        }
      };
    } catch (error) {
      return {
        status: 'error',
        details: { error: (error as Error).message }
      };
    }
  }

  async createIndexes(): Promise<void> {
    try {
      // Create text indexes for search functionality
      await mongoose.connection.db.collection('courses').createIndex({
        title: 'text',
        description: 'text',
        'lessons.title': 'text',
        'lessons.content': 'text'
      });

      await mongoose.connection.db.collection('users').createIndex({
        email: 1
      }, { unique: true });

      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }
}

export default new Database();
