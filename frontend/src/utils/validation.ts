export interface ValidationResult {
    isValid: boolean;
    message?: string;
  }
  
  export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  };
  
  export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    return { isValid: true };
  };
  
  export const validateName = (name: string): ValidationResult => {
    if (!name || name.trim().length === 0) {
      return { isValid: false, message: 'Name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long' };
    }
    
    return { isValid: true };
  };
  
  export const validatePhoneNumber = (phone: string): ValidationResult => {
    if (!phone) {
      return { isValid: true }; // Phone is optional
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: 'Please enter a valid Indian mobile number' };
    }
    
    return { isValid: true };
  };
  
  export const validateQuantity = (quantity: string): ValidationResult => {
    if (!quantity) {
      return { isValid: false, message: 'Quantity is required' };
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return { isValid: false, message: 'Quantity must be a positive number' };
    }
    
    if (qty > 10000) {
      return { isValid: false, message: 'Maximum quantity allowed is 10,000' };
    }
    
    return { isValid: true };
  };
  