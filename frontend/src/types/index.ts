export interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    preferredLanguage: string;
    profile: UserProfile;
    progress: UserProgress;
    virtualPortfolio: VirtualPortfolio;
    settings: UserSettings;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserProfile {
    age?: number;
    occupation?: string;
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
    riskTolerance: 'low' | 'medium' | 'high';
  }
  
  export interface UserProgress {
    coursesCompleted: string[];
    currentLevel: number;
    totalPoints: number;
    achievements: string[];
  }
  
  export interface VirtualPortfolio {
    cash: number;
    holdings: Holding[];
    totalValue: number;
    dayGainLoss: number;
    totalGainLoss: number;
  }
  
  export interface Holding {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
  }
  
  export interface UserSettings {
    notifications: boolean;
    biometricAuth: boolean;
    darkMode: boolean;
  }
  
  export interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    lessons: Lesson[];
    quiz: Quiz;
    tags: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Lesson {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    resources: string[];
  }
  
  export interface Quiz {
    questions: Question[];
    passingScore: number;
  }
  
  export interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }
  
  export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    pe?: number;
    dayHigh: number;
    dayLow: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
  }
  
  export interface Transaction {
    type: 'BUY' | 'SELL';
    symbol: string;
    quantity: number;
    price: number;
    totalCost?: number;
    totalValue?: number;
    timestamp: string;
  }
  