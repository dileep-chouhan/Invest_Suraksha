import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  userId: string;
  courseId: string;
  answers: number[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  passed: boolean;
  attemptDate: Date;
  feedback?: string;
}

const QuizSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  answers: [{
    type: Number,
    required: true
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptDate: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
QuizSchema.index({ userId: 1, courseId: 1 });
QuizSchema.index({ attemptDate: -1 });
QuizSchema.index({ passed: 1 });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
