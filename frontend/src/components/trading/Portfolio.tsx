import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Holding } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

interface Props {
  holdings: Holding[];
}

const Portfolio: React.FC<Props> = ({ holdings }) => {
  const renderItem = ({ item }: { item: Holding }) => {
    const currentValue = item.currentPrice * item.quantity;
    const investedValue = item.averagePrice * item.quantity;
    const gainLoss = currentValue - investedValue;
    const gainLossPercent = (gainLoss / investedValue) * 100;

    return (
      <View style={styles.holdingItem}>
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.details}>
            {item.quantity} @ {formatCurrency(item.averagePrice)}
          </Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.currentValue}>{formatCurrency(currentValue)}</Text>
          <Text style={[styles.gainLoss, { color: gainLoss >= 0 ? COLORS.success : COLORS.error }]}>
            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({formatPercentage(gainLossPercent)})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  symbol: {
    ...FONTS.h3,
    color: COLORS.text
  },
  details: {
    ...FONTS.body4,
    color: COLORS.textLight
  },
  valueContainer: {
    alignItems: 'flex-end'
  },
  currentValue: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: 'bold'
  },
  gainLoss: {
    ...FONTS.body4,
    marginTop: 4
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.base
  }
});

export default Portfolio;
