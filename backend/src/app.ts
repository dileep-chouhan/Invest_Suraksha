import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';

// Import routes
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import tradingRoutes from './routes/trading';
import translationRoutes from './routes/translation';

// Import services
import { StockService } from './services/stockService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/translation', translationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Real-time stock data updates
const stockService = new StockService();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send real-time market data every 5 seconds
  const marketDataInterval = setInterval(async () => {
    try {
      const marketData = stockService.generateMockMarketData();
      socket.emit('marketData', marketData);
    } catch (error) {
      console.error('Error sending market data:', error);
    }
  }, 5000);

  socket.on('subscribe', (symbols) => {
    console.log(`Client ${socket.id} subscribed to:`, symbols);
    // Join rooms for specific symbols
    symbols.forEach((symbol: string) => {
      socket.join(symbol);
    });
  });

  socket.on('unsubscribe', (symbols) => {
    symbols.forEach((symbol: string) => {
      socket.leave(symbol);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(marketDataInterval);
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
