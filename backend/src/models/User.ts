import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  preferredLanguage: string;
  profile: {
    age?: number;
    occupation?: string;
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
    riskTolerance: 'low' | 'medium' | 'high';
  };
  progress: {
    coursesCompleted: string[];
    currentLevel: number;
    totalPoints: number;
    achievements: string[];
  };
  virtualPortfolio: {
    cash: number;
    holdings: [{
      symbol: string;
      quantity: number;
      averagePrice: number;
      currentPrice: number;
    }];
    totalValue: number;
    dayGainLoss: number;
    totalGainLoss: number;
  };
  settings: {
    notifications: boolean;
    biometricAuth: boolean;
    darkMode: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String },
  preferredLanguage: { type: String, default: 'en' },
  profile: {
    age: Number,
    occupation: String,
    investmentExperience: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    riskTolerance: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  progress: {
    coursesCompleted: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    currentLevel: { type: Number, default: 1 },
    totalPoints: { type: Number, default: 0 },
    achievements: [String]
  },
  virtualPortfolio: {
    cash: { type: Number, default: 1000000 }, // ₹10 lakh virtual money
    holdings: [{
      symbol: String,
      quantity: Number,
      averagePrice: Number,
      currentPrice: Number
    }],
    totalValue: { type: Number, default: 1000000 },
    dayGainLoss: { type: Number, default: 0 },
    totalGainLoss: { type: Number, default: 0 }
  },
  settings: {
    notifications: { type: Boolean, default: true },
    biometricAuth: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
