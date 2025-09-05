import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';
import { StockData } from '../types';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<StockData[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [marketResponse, portfolioResponse] = await Promise.all([
        ApiService.getMarketData(),
        ApiService.getPortfolio()
      ]);
      
      setMarketData(marketResponse.marketData || []);
      setPortfolio(portfolioResponse.portfolio);
    } catch (error) {
      console.error('Error loading home data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.level}>Level {user?.progress.currentLevel}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Portfolio Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Portfolio Overview</Text>
        <View style={styles.portfolioStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ₹{portfolio?.totalValue?.toLocaleString() || '10,00,000'}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: (portfolio?.totalGainLoss || 0) >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              ₹{Math.abs(portfolio?.totalGainLoss || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>
              {(portfolio?.totalGainLoss || 0) >= 0 ? 'Profit' : 'Loss'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Trading')}
        >
          <Text style={styles.actionButtonText}>View Full Portfolio</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Tracker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learning Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((user?.progress.totalPoints || 0) / 1000 * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {user?.progress.totalPoints || 0} / 1000 points to next level
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Education')}
        >
          <Text style={styles.actionButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>

      {/* Market Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Market Overview</Text>
        
        {marketData.slice(0, 3).map((stock, index) => (
          <View key={index} style={styles.stockItem}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <Text style={styles.stockName}>{stock.name}</Text>
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
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Trading')}
        >
          <Text style={styles.actionButtonText}>View All Stocks</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Education')}
          >
            <Ionicons name="book" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Learn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Trading')}
          >
            <Ionicons name="trending-up" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Trade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Ionicons name="help-circle" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Portfolio Performance</Text>
        <LineChart
          data={mockChartData}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
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
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  level: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
  stockPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  changeText: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontWeight: '500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default HomeScreen;
