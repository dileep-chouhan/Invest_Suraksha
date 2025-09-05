import { Dimensions } from 'react-native';

export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://your-production-api.com/api';

export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textDark: '#000000',
  border: '#e0e0e0',
  disabled: '#cccccc',
  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 20,
  margin: 16,
  
  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  
  // App dimensions
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const FONTS = {
  largeTitle: { fontFamily: "Roboto-regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
  h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const COURSE_CATEGORIES = [
  { id: 'basics', name: 'Stock Market Basics', icon: 'book-outline' },
  { id: 'trading', name: 'Trading Strategies', icon: 'trending-up-outline' },
  { id: 'analysis', name: 'Technical Analysis', icon: 'analytics-outline' },
  { id: 'risk-management', name: 'Risk Management', icon: 'shield-checkmark-outline' },
  { id: 'portfolio', name: 'Portfolio Management', icon: 'briefcase-outline' },
  { id: 'derivatives', name: 'Derivatives', icon: 'swap-horizontal-outline' },
  { id: 'mutual-funds', name: 'Mutual Funds', icon: 'people-outline' },
  { id: 'taxation', name: 'Tax Planning', icon: 'calculator-outline' },
];

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: COLORS.success },
  { id: 'intermediate', name: 'Intermediate', color: COLORS.warning },
  { id: 'advanced', name: 'Advanced', color: COLORS.error },
];

export const ACHIEVEMENT_BADGES = {
  FIRST_COURSE: { name: 'First Steps', icon: 'trophy-outline', color: COLORS.warning },
  QUIZ_MASTER: { name: 'Quiz Master', icon: 'school-outline', color: COLORS.primary },
  TRADING_BEGINNER: { name: 'First Trade', icon: 'trending-up-outline', color: COLORS.success },
  PORTFOLIO_BUILDER: { name: 'Portfolio Builder', icon: 'briefcase-outline', color: COLORS.info },
  LEVEL_UP: { name: 'Level Up', icon: 'rocket-outline', color: COLORS.secondary },
  STREAK_KEEPER: { name: 'Learning Streak', icon: 'flame-outline', color: COLORS.error },
};
