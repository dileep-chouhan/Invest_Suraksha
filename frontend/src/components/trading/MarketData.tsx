import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';
import { StockData } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

interface Props {
  marketData: StockData[];
}

const MarketData: React.FC<Props> = ({ marketData }) => {
  const renderItem = ({ item }: { item: StockData }) => (
    <View style={styles.row}>
      <View style={styles.symbolContainer}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        <Text style={[
          styles.change,
          { color: item.change >= 0 ? COLORS.success : COLORS.error }
        ]}>
          {formatPercentage(item.changePercent)}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={marketData}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  symbolContainer: {},
  symbol: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: 'bold'
  },
  name: {
    ...FONTS.body4,
    color: COLORS.textLight
  },
  priceContainer: {
    alignItems: 'flex-end'
  },
  price: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: 'bold'
  },
  change: {
    ...FONTS.body4,
    marginTop: 4
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.base
  }
});

export default MarketData;
