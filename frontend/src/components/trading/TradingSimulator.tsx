import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import ApiService from '../../services/api';
import { StockData, Holding } from '../../types';

const TradingSimulator: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTradingData();
    const interval = setInterval(loadTradingData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTradingData = async () => {
    try {
      const [marketResponse, portfolioResponse] = await Promise.all([
        ApiService.getMarketData(),
        ApiService.getPortfolio()
      ]);
      
      setStocks(marketResponse.marketData || []);
      setPortfolio(portfolioResponse.portfolio);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trading data:', error);
      Alert.alert('Error', 'Failed to load trading data');
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!selectedStock || !quantity) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (tradeType === 'BUY') {
        response = await ApiService.buyStock(selectedStock.symbol, qty);
      } else {
        response = await ApiService.sellStock(selectedStock.symbol, qty);
      }

      Alert.alert('Success', response.message);
      setTradeModalVisible(false);
      setQuantity('');
      loadTradingData(); // Refresh data
    } catch (error: any) {
      console.error('Trade error:', error);
      Alert.alert('Trade Failed', error.response?.data?.message || 'Failed to execute trade');
    } finally {
      setLoading(false);
    }
  };

  const openTradeModal = (stock: StockData, type: 'BUY' | 'SELL') => {
    setSelectedStock(stock);
    setTradeType(type);
    setTradeModalVisible(true);
  };

  const getHolding = (symbol: string): Holding | undefined => {
    return portfolio?.holdings?.find((h: Holding) => h.symbol === symbol);
  };

  if (loading && !stocks.length) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading market data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Virtual Portfolio</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cash</Text>
            <Text style={styles.summaryValue}>
              ₹{portfolio?.cash?.toLocaleString() || '0'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Value</Text>
            <Text style={styles.summaryValue}>
              ₹{portfolio?.totalValue?.toLocaleString() || '0'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>P&L</Text>
            <Text style={[
              styles.summaryValue,
              { color: (portfolio?.totalGainLoss || 0) >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {(portfolio?.totalGainLoss || 0) >= 0 ? '+' : ''}
              ₹{Math.abs(portfolio?.totalGainLoss || 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Market Stocks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Market Stocks</Text>
        {stocks.map((stock, index) => {
          const holding = getHolding(stock.symbol);
          return (
            <View key={index} style={styles.stockItem}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                <Text style={styles.stockName}>{stock.name}</Text>
                {holding && (
                  <Text style={styles.holdingText}>
                    Holding: {holding.quantity} shares
                  </Text>
                )}
              </View>
              
              <View style={styles.stockPrice}>
                <Text style={styles.priceText}>₹{stock.price.toFixed(2)}</Text>
                <Text style={[
                  styles.changeText,
                  { color: stock.change >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </Text>
              </View>
              
              <View style={styles.tradeButtons}>
                <TouchableOpacity
                  style={[styles.tradeButton, styles.buyButton]}
                  onPress={() => openTradeModal(stock, 'BUY')}
                >
                  <Text style={styles.tradeButtonText}>BUY</Text>
                </TouchableOpacity>
                
                {holding && holding.quantity > 0 && (
                  <TouchableOpacity
                    style={[styles.tradeButton, styles.sellButton]}
                    onPress={() => openTradeModal(stock, 'SELL')}
                  >
                    <Text style={styles.tradeButtonText}>SELL</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Holdings */}
      {portfolio?.holdings?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Holdings</Text>
          {portfolio.holdings.map((holding: Holding, index: number) => {
            const currentValue = holding.currentPrice * holding.quantity;
            const investedValue = holding.averagePrice * holding.quantity;
            const gainLoss = currentValue - investedValue;
            const gainLossPercent = (gainLoss / investedValue) * 100;

            return (
              <View key={index} style={styles.holdingItem}>
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                  <Text style={styles.holdingDetails}>
                    {holding.quantity} shares @ ₹{holding.averagePrice.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.holdingValue}>
                  <Text style={styles.holdingCurrentValue}>
                    ₹{currentValue.toLocaleString()}
                  </Text>
                  <Text style={[
                    styles.holdingGainLoss,
                    { color: gainLoss >= 0 ? '#4CAF50' : '#F44336' }
                  ]}>
                    {gainLoss >= 0 ? '+' : ''}₹{Math.abs(gainLoss).toFixed(2)}
                    ({gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Trade Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tradeModalVisible}
        onRequestClose={() => setTradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {tradeType} {selectedStock?.symbol}
              </Text>
              <TouchableOpacity
                onPress={() => setTradeModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Current Price:</Text>
              <Text style={styles.modalPrice}>
                ₹{selectedStock?.price.toFixed(2)}
              </Text>

              <Text style={styles.modalLabel}>Quantity:</Text>
              <TextInput
                style={styles.modalInput}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />

              {quantity && selectedStock && (
                <View style={styles.orderSummary}>
                  <Text style={styles.orderSummaryLabel}>Order Value:</Text>
                  <Text style={styles.orderSummaryValue}>
                    ₹{(selectedStock.price * parseInt(quantity || '0')).toLocaleString()}
                  </Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setTradeModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    tradeType === 'BUY' ? styles.buyButton : styles.sellButton
                  ]}
                  onPress={handleTrade}
                  disabled={loading}
                >
                  <Text style={styles.tradeButtonText}>
                    {loading ? 'Processing...' : `${tradeType} Now`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#667eea',
    margin: 15,
    borderRadius: 15,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stockName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  holdingText: {
    fontSize: 11,
    color: '#667eea',
    marginTop: 2,
  },
  stockPrice: {
    alignItems: 'center',
    marginRight: 15,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  changeText: {
    fontSize: 12,
    marginTop: 2,
  },
  tradeButtons: {
    flexDirection: 'row',
  },
  tradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  tradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  holdingDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  holdingCurrentValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  holdingGainLoss: {
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderSummaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  orderSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TradingSimulator;
