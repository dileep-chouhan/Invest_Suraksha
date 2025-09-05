import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api';
import { Course } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import { getDifficultyColor } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

interface Props {
  navigation: any;
  category?: string;
}

const CourseList: React.FC<Props> = ({ navigation, category }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCourses({ category });
      setCourses(response.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item._id })}
    >
      <View style={styles.courseHeader}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.difficultyText}>{item.difficulty.toUpperCase()}</Text>
        </View>
        <Text style={styles.duration}>{item.estimatedTime} min</Text>
      </View>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription} numberOfLines={3}>{item.description}</Text>
      <View style={styles.courseFooter}>
        <Text style={styles.category}>{item.category}</Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item._id}
      renderItem={renderCourse}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding
  },
  courseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 12
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  duration: {
    ...FONTS.body4,
    color: COLORS.textLight
  },
  courseTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  courseDescription: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginBottom: SIZES.margin
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  category: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});

export default CourseList;
