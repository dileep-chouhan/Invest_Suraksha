import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const serverURL = API_BASE_URL.replace('/api', '');
    socketRef.current = io(serverURL);

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('marketData', (data: any[]) => {
      setMarketData(data);
    });

    socket.on('stockUpdate', (data: any) => {
      setMarketData(prevData => 
        prevData.map(stock => 
          stock.symbol === data.symbol ? { ...stock, ...data } : stock
        )
      );
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const subscribeToStock = (symbol: string) => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe', [symbol]);
    }
  };

  const subscribeToStocks = (symbols: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe', symbols);
    }
  };

  return {
    isConnected,
    marketData,
    subscribeToStock,
    subscribeToStocks,
  };
};
