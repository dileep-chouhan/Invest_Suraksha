import mongoose, { Schema, Document } from 'mongoose';

export interface ITranslation extends Document {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  userId?: string;
  context?: string;
  confidence?: number;
}

const TranslationSchema: Schema = new Schema({
  originalText: {
    type: String,
    required: true,
    maxlength: 5000
  },
  translatedText: {
    type: String,
    required: true,
    maxlength: 5000
  },
  sourceLanguage: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 2,
    maxlength: 5
  },
  targetLanguage: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 2,
    maxlength: 5
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  context: {
    type: String,
    enum: ['course', 'quiz', 'ui', 'general'],
    default: 'general'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

// Indexes for analytics and caching
TranslationSchema.index({ targetLanguage: 1, timestamp: -1 });
TranslationSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
TranslationSchema.index({ 
  originalText: 'text', 
  translatedText: 'text' 
}, {
  weights: {
    originalText: 10,
    translatedText: 5
  }
});

// TTL index to automatically remove old translations after 90 days
TranslationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model<ITranslation>('Translation', TranslationSchema);
