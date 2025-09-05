import { Router } from 'express';
import { TradingController } from '../controllers/tradingController';
import { authenticateToken } from '../middleware/auth';
import { tradingLimiter } from '../middleware/rateLimit';
import { validate, tradingSchema, validateObjectId } from '../middleware/validation';

const router = Router();
const tradingController = new TradingController();

// Protected routes
router.get('/portfolio', authenticateToken, tradingController.getPortfolio);
router.post('/buy', authenticateToken, tradingLimiter, validate(tradingSchema), tradingController.buyStock);
router.post('/sell', authenticateToken, tradingLimiter, validate(tradingSchema), tradingController.sellStock);
router.get('/market/:symbol?', authenticateToken, tradingController.getMarketData);
router.get('/watchlist', authenticateToken, tradingController.getWatchlist);
router.post('/watchlist', authenticateToken, tradingController.addToWatchlist);
router.delete('/watchlist/:symbol', authenticateToken, tradingController.removeFromWatchlist);
router.get('/history', authenticateToken, tradingController.getTransactionHistory);
router.get('/portfolio/history', authenticateToken, tradingController.getPortfolioHistory);
router.get('/analysis', authenticateToken, tradingController.getPortfolioAnalysis);
router.post('/limit-order', authenticateToken, tradingLimiter, tradingController.placeLimitOrder);
router.get('/orders', authenticateToken, tradingController.getOrders);
router.delete('/orders/:orderId', authenticateToken, validateObjectId, tradingController.cancelOrder);

export default router;
