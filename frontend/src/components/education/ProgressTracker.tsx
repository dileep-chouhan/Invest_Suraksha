import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import { UserProgress } from '../../types';

interface Props {
  progress: UserProgress;
}

const ProgressTracker: React.FC<Props> = ({ progress }) => {
  const progressPercentage = Math.min((progress.totalPoints / 1000) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.level}>Level {progress.currentLevel}</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress.totalPoints} / 1000 XP to next level
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="book" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{progress.coursesCompleted.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>{progress.achievements.length}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>{progress.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    margin: SIZES.margin,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text
  },
  level: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  progressSection: {
    marginBottom: SIZES.margin
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  progressText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.base
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: 4
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: 2
  }
});

export default ProgressTracker;
