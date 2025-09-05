import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
  userId?: string;
  requestId?: string;
}

export class Logger {
  private logDir: string;
  private logFile: string;
  private errorLogFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this.errorLogFile = path.join(this.logDir, 'error.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, meta, userId, requestId } = entry;
    let logLine = `[${timestamp}] ${level}: ${message}`;
    
    if (userId) logLine += ` | UserId: ${userId}`;
    if (requestId) logLine += ` | RequestId: ${requestId}`;
    if (meta) logLine += ` | Meta: ${JSON.stringify(meta)}`;
    
    return logLine;
  }

  private writeToFile(entry: LogEntry): void {
    const logLine = this.formatLogEntry(entry) + '\n';
    
    try {
      fs.appendFileSync(this.logFile, logLine);
      
      // Also write errors to separate error log
      if (entry.level === LogLevel.ERROR) {
        fs.appendFileSync(this.errorLogFile, logLine);
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private log(level: LogLevel, message: string, meta?: any, userId?: string, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      userId,
      requestId
    };

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const colorMap = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[36m',  // Cyan
        [LogLevel.DEBUG]: '\x1b[90m'  // Gray
      };
      
      console.log(
        `${colorMap[level]}${this.formatLogEntry(entry)}\x1b[0m`
      );
    }

    // Write to file in production
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(entry);
    }
  }

  error(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.ERROR, message, meta, userId, requestId);
  }

  warn(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.WARN, message, meta, userId, requestId);
  }

  info(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.INFO, message, meta, userId, requestId);
  }

  debug(message: string, meta?: any, userId?: string, requestId?: string): void {
    this.log(LogLevel.DEBUG, message, meta, userId, requestId);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, userId?: string, requestId?: string): void {
    this.info(`API Request: ${method} ${url}`, { method, url }, userId, requestId);
  }

  apiResponse(method: string, url: string, statusCode: number, responseTime: number, userId?: string, requestId?: string): void {
    this.info(
      `API Response: ${method} ${url} - ${statusCode} (${responseTime}ms)`,
      { method, url, statusCode, responseTime },
      userId,
      requestId
    );
  }

  dbQuery(operation: string, collection: string, duration: number, userId?: string): void {
    this.debug(
      `DB Query: ${operation} on ${collection} (${duration}ms)`,
      { operation, collection, duration },
      userId
    );
  }

  authAttempt(email: string, success: boolean, ip: string): void {
    const message = `Auth attempt: ${email} - ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      this.info(message, { email, ip });
    } else {
      this.warn(message, { email, ip });
    }
  }

  tradingAction(userId: string, action: string, symbol: string, quantity: number, price: number): void {
    this.info(
      `Trading: ${action} ${quantity} ${symbol} @ ₹${price}`,
      { action, symbol, quantity, price },
      userId
    );
  }

  courseProgress(userId: string, courseId: string, action: string): void {
    this.info(
      `Course Progress: ${action}`,
      { courseId, action },
      userId
    );
  }

  translationRequest(sourceLanguage: string, targetLanguage: string, textLength: number): void {
    this.info(
      `Translation: ${sourceLanguage} -> ${targetLanguage} (${textLength} chars)`,
      { sourceLanguage, targetLanguage, textLength }
    );
  }

  // Log rotation
  rotateLogs(): void {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];
    
    try {
      if (fs.existsSync(this.logFile)) {
        const rotatedLogFile = path.join(this.logDir, `app_${timestamp}.log`);
        fs.renameSync(this.logFile, rotatedLogFile);
      }
      
      if (fs.existsSync(this.errorLogFile)) {
        const rotatedErrorLogFile = path.join(this.logDir, `error_${timestamp}.log`);
        fs.renameSync(this.errorLogFile, rotatedErrorLogFile);
      }
      
      this.info('Log files rotated successfully');
    } catch (error) {
      this.error('Failed to rotate log files', { error: (error as Error).message });
    }
  }

  // Clean old logs
  cleanOldLogs(daysToKeep: number = 30): void {
    try {
      const files = fs.readdirSync(this.logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate && file.includes('_')) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', { error: (error as Error).message });
    }
  }
}

export default new Logger();
