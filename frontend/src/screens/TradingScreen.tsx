import React from 'react';
import { View, StyleSheet } from 'react-native';
import TradingSimulator from '../components/trading/TradingSimulator';
import Header from '../components/common/Header';
import { COLORS } from '../utils/constants';

const TradingScreen: React.FC = () => (
  <View style={styles.container}>
    <Header title="Trade" />
    <TradingSimulator />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});

export default TradingScreen;
