import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartData } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';

interface Props {
  data: ChartData;
}

const StockChart: React.FC<Props> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width - SIZES.padding * 2;
  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => COLORS.primary,
    labelColor: () => COLORS.text,
    propsForDots: {
      r: '2',
      strokeWidth: '1',
      stroke: COLORS.primary
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    margin: SIZES.margin
  },
  chart: {
    borderRadius: SIZES.radius
  }
});

export default StockChart;
