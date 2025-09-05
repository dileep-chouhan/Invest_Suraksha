import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SIZES, FONTS, ACHIEVEMENT_BADGES } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const AchievementsScreen: React.FC = () => {
  const { user } = useAuth();
  const achievements = user?.progress.achievements || [];

  const renderItem = ({ item }: { item: string }) => {
    const badge = ACHIEVEMENT_BADGES[item as keyof typeof ACHIEVEMENT_BADGES] || {
      name: item,
      icon: 'trophy-outline',
      color: COLORS.primary
    };
    return (
      <View style={styles.item}>
        <Ionicons name={badge.icon as any} size={32} color={badge.color} />
        <Text style={styles.name}>{badge.name}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={achievements}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No achievements yet</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SIZES.margin
  },
  item: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    elevation: 2
  },
  name: {
    ...FONTS.body3,
    color: COLORS.text,
    marginTop: SIZES.base,
    textAlign: 'center'
  },
  empty: {
    alignItems: 'center',
    marginTop: SIZES.padding
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.textLight
  }
});

export default AchievementsScreen;
