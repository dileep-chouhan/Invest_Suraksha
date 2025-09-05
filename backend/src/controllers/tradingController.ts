import { Request, Response } from 'express';
import User from '../models/User';
import { StockService } from '../services/stockService';

const stockService = new StockService();

export class TradingController {
  async getPortfolio(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update current prices for holdings
      const updatedHoldings = await Promise.all(
        user.virtualPortfolio.holdings.map(async (holding) => {
          const stockData = await stockService.getStockQuote(holding.symbol);
          if (stockData) {
            holding.currentPrice = stockData.price;
          }
          return holding;
        })
      );

      // Calculate total portfolio value
      const holdingsValue = updatedHoldings.reduce(
        (total, holding) => total + (holding.currentPrice * holding.quantity), 
        0
      );
      
      const totalValue = user.virtualPortfolio.cash + holdingsValue;
      const totalGainLoss = totalValue - 1000000; // Initial amount was ₹10 lakh

      // Update user portfolio
      user.virtualPortfolio.holdings = updatedHoldings;
      user.virtualPortfolio.totalValue = totalValue;
      user.virtualPortfolio.totalGainLoss = totalGainLoss;
      await user.save();

      res.json({
        portfolio: {
          cash: user.virtualPortfolio.cash,
          holdings: updatedHoldings,
          totalValue,
          totalGainLoss,
          dayGainLoss: user.virtualPortfolio.dayGainLoss
        }
      });
    } catch (error) {
      console.error('Get portfolio error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async buyStock(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { symbol, quantity } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get current stock price
      const stockData = await stockService.getStockQuote(symbol);
      if (!stockData) {
        return res.status(400).json({ message: 'Invalid stock symbol' });
      }

      const totalCost = stockData.price * quantity;

      // Check if user has enough cash
      if (user.virtualPortfolio.cash < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      // Find existing holding
      const existingHolding = user.virtualPortfolio.holdings.find(
        h => h.symbol === symbol
      );

      if (existingHolding) {
        // Update existing holding
        const newQuantity = existingHolding.quantity + quantity;
        const newAveragePrice = (
          (existingHolding.averagePrice * existingHolding.quantity) + 
          (stockData.price * quantity)
        ) / newQuantity;

        existingHolding.quantity = newQuantity;
        existingHolding.averagePrice = newAveragePrice;
        existingHolding.currentPrice = stockData.price;
      } else {
        // Add new holding
        user.virtualPortfolio.holdings.push({
          symbol,
          quantity,
          averagePrice: stockData.price,
          currentPrice: stockData.price
        });
      }

      // Deduct cash
      user.virtualPortfolio.cash -= totalCost;

      await user.save();

      res.json({
        message: 'Stock purchased successfully',
        transaction: {
          type: 'BUY',
          symbol,
          quantity,
          price: stockData.price,
          totalCost
        },
        remainingCash: user.virtualPortfolio.cash
      });
    } catch (error) {
      console.error('Buy stock error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async sellStock(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { symbol, quantity } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find holding
      const holding = user.virtualPortfolio.holdings.find(h => h.symbol === symbol);
      if (!holding) {
        return res.status(400).json({ message: 'Stock not found in portfolio' });
      }

      if (holding.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient shares' });
      }

      // Get current stock price
      const stockData = await stockService.getStockQuote(symbol);
      if (!stockData) {
        return res.status(400).json({ message: 'Unable to get current stock price' });
      }

      const totalValue = stockData.price * quantity;

      // Update holding
      holding.quantity -= quantity;
      holding.currentPrice = stockData.price;

      // If quantity becomes 0, remove holding
      if (holding.quantity === 0) {
        user.virtualPortfolio.holdings = user.virtualPortfolio.holdings.filter(
          h => h.symbol !== symbol
        );
      }

      // Add cash
      user.virtualPortfolio.cash += totalValue;

      await user.save();

      res.json({
        message: 'Stock sold successfully',
        transaction: {
          type: 'SELL',
          symbol,
          quantity,
          price: stockData.price,
          totalValue
        },
        newCashBalance: user.virtualPortfolio.cash
      });
    } catch (error) {
      console.error('Sell stock error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMarketData(req: Request, res: Response) {
    try {
      const { symbol } = req.params;

      if (symbol) {
        const stockData = await stockService.getStockQuote(symbol);
        return res.json({ stockData });
      }

      // Get market overview
      const marketData = await stockService.getMarketOverview();
      res.json({ marketData });
    } catch (error) {
      console.error('Get market data error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getWatchlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // For now, return mock watchlist - can be extended to save user watchlists
      const defaultSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR'];
      const watchlistData = await Promise.all(
        defaultSymbols.map(symbol => stockService.getStockQuote(symbol))
      );

      res.json({ watchlist: watchlistData.filter(Boolean) });
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
