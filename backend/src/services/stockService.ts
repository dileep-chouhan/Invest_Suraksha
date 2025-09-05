import axios from 'axios';
import { config } from '../config';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

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

export class StockService {
  private alphaVantageKey = config.apis.alphaVantage;

  async getStockQuote(symbol: string): Promise<StockData | null> {
    const cacheKey = `stock_${symbol}`;
    const cached = cache.get<StockData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );

      const data = response.data['Global Quote'];
      if (!data || Object.keys(data).length === 0) {
        return null;
      }

      const stockData: StockData = {
        symbol: data['01. symbol'],
        name: symbol, // In real app, get company name from another endpoint
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: parseFloat(data['10. change percent'].replace('%', '')),
        volume: parseInt(data['06. volume']),
        dayHigh: parseFloat(data['03. high']),
        dayLow: parseFloat(data['04. low']),
        fiftyTwoWeekHigh: parseFloat(data['03. high']), // Simplified
        fiftyTwoWeekLow: parseFloat(data['04. low']) // Simplified
      };

      cache.set(cacheKey, stockData);
      return stockData;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  }

  async getMarketOverview(): Promise<StockData[]> {
    const symbols = ['RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'HINDUNILVR.BSE'];
    const promises = symbols.map(symbol => this.getStockQuote(symbol));
    const results = await Promise.all(promises);
    return results.filter(data => data !== null) as StockData[];
  }

  async getHistoricalData(symbol: string, interval: string = 'daily'): Promise<any> {
    const cacheKey = `historical_${symbol}_${interval}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );

      const data = response.data['Time Series (Daily)'];
      cache.set(cacheKey, data, 3600); // Cache for 1 hour
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
    }
  }

  // Simulate market data for virtual trading
  generateMockMarketData() {
    const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'ASIANPAINT'];
    
    return symbols.map(symbol => ({
      symbol,
      name: `${symbol} Ltd`,
      price: Math.random() * 3000 + 100,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000),
      dayHigh: Math.random() * 3100 + 100,
      dayLow: Math.random() * 2900 + 100,
      fiftyTwoWeekHigh: Math.random() * 3500 + 100,
      fiftyTwoWeekLow: Math.random() * 1500 + 100
    }));
  }
}
