import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../utils/constants';

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<Props> = ({ state, descriptors, navigation }) => (
  <View style={styles.container}>
    {state.routes.map((route: any, index: number) => {
      const { options } = descriptors[route.key];
      const label = route.name;
      const icon = options.tabBarIcon as keyof typeof Ionicons.glyphMap;
      const isFocused = state.index === index;

      const onPress = () => {
        if (!isFocused) {
          navigation.navigate(route.name);
        }
      };

      return (
        <TouchableOpacity
          key={route.key}
          onPress={onPress}
          style={styles.tab}
        >
          <Ionicons
            name={icon}
            size={24}
            color={isFocused ? COLORS.primary : COLORS.textLight}
          />
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: SIZES.tabBarHeight,
    backgroundColor: COLORS.surface,
    elevation: 10
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TabBar;
