import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../utils/constants';

interface Order {
  price: number;
  quantity: number;
}

interface Props {
  bids: Order[];
  asks: Order[];
}

const OrderBook: React.FC<Props> = ({ bids, asks }) => {
  const renderOrder = (order: Order, isBid: boolean) => (
    <View style={styles.orderRow}>
      <Text style={[styles.price, { color: isBid ? COLORS.success : COLORS.error }]}>
        {order.price.toFixed(2)}
      </Text>
      <Text style={styles.quantity}>{order.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Book</Text>
      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bids</Text>
          <FlatList
            data={bids}
            keyExtractor={(_, i) => `bid-${i}`}
            renderItem={({ item }) => renderOrder(item, true)}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asks</Text>
          <FlatList
            data={asks}
            keyExtractor={(_, i) => `ask-${i}`}
            renderItem={({ item }) => renderOrder(item, false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SIZES.margin,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    elevation: 2
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  section: {
    flex: 1
  },
  sectionTitle: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.base
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base
  },
  price: {
    ...FONTS.body3
  },
  quantity: {
    ...FONTS.body4,
    color: COLORS.textLight
  }
});

export default OrderBook;
