import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
  orderType: 'MARKET' | 'LIMIT';
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
}

export interface IWatchlist extends Document {
  userId: string;
  stocks: [{
    symbol: string;
    addedDate: Date;
    notes?: string;
  }];
}

export interface IPortfolioHistory extends Document {
  userId: string;
  date: Date;
  totalValue: number;
  cashValue: number;
  investedValue: number;
  dayGainLoss: number;
  totalGainLoss: number;
  holdings: [{
    symbol: string;
    quantity: number;
    price: number;
    value: number;
  }];
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  orderType: {
    type: String,
    enum: ['MARKET', 'LIMIT'],
    default: 'MARKET'
  },
  status: {
    type: String,
    enum: ['PENDING', 'EXECUTED', 'CANCELLED'],
    default: 'EXECUTED'
  }
}, {
  timestamps: true
});

const WatchlistSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  stocks: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    addedDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

const PortfolioHistorySchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  cashValue: {
    type: Number,
    required: true
  },
  investedValue: {
    type: Number,
    required: true
  },
  dayGainLoss: {
    type: Number,
    default: 0
  },
  totalGainLoss: {
    type: Number,
    default: 0
  },
  holdings: [{
    symbol: String,
    quantity: Number,
    price: Number,
    value: Number
  }]
}, {
  timestamps: true
});

// Compound indexes
TransactionSchema.index({ userId: 1, timestamp: -1 });
TransactionSchema.index({ symbol: 1, timestamp: -1 });
PortfolioHistorySchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
export const PortfolioHistory = mongoose.model<IPortfolioHistory>('PortfolioHistory', PortfolioHistorySchema);
