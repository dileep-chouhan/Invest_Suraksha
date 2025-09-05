import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  lessons: [{
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    resources: string[];
  }];
  quiz: {
    questions: [{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }];
    passingScore: number;
  };
  tags: string[];
  isActive: boolean;
  translations: [{
    language: string;
    title: string;
    description: string;
    lessons: [{
      title: string;
      content: string;
    }];
  }];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  estimatedTime: { type: Number, required: true },
  lessons: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: String,
    duration: { type: Number, required: true },
    resources: [String]
  }],
  quiz: {
    questions: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
      explanation: { type: String, required: true }
    }],
    passingScore: { type: Number, default: 70 }
  },
  tags: [String],
  isActive: { type: Boolean, default: true },
  translations: [{
    language: String,
    title: String,
    description: String,
    lessons: [{
      title: String,
      content: String
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model<ICourse>('Course', CourseSchema);
