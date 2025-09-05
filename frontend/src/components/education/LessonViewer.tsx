import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import VideoPlayer from './VideoPlayer';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const LessonViewer: React.FC<Props> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{lesson.title}</Text>
      
      {lesson.videoUrl && (
        <VideoPlayer uri={lesson.videoUrl} onComplete={handleComplete} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.contentText}>{lesson.content}</Text>
      </View>

      {lesson.resources && lesson.resources.length > 0 && (
        <View style={styles.resources}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          {lesson.resources.map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceItem}>
              <Ionicons name="link-outline" size={20} color={COLORS.primary} />
              <Text style={styles.resourceText}>{resource}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleComplete}
          disabled={completed}
        >
          <Text style={styles.buttonText}>
            {completed ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        {hasPrevious && (
          <TouchableOpacity style={styles.navButton} onPress={onPrevious}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.navText}>Previous</Text>
          </TouchableOpacity>
        )}
        {hasNext && (
          <TouchableOpacity style={styles.navButton} onPress={onNext}>
            <Text style={styles.navText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    padding: SIZES.padding,
    paddingBottom: SIZES.base
  },
  content: {
    padding: SIZES.padding
  },
  contentText: {
    ...FONTS.body3,
    color: COLORS.text,
    lineHeight: 24
  },
  resources: {
    padding: SIZES.padding,
    paddingTop: 0
  },
  resourcesTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  resourceText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginLeft: SIZES.base
  },
  actions: {
    padding: SIZES.padding
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base,
    alignItems: 'center'
  },
  completeButton: {
    backgroundColor: COLORS.success
  },
  buttonText: {
    ...FONTS.body3,
    color: '#fff',
    fontWeight: 'bold'
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingTop: 0
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginHorizontal: SIZES.base
  }
});

export default LessonViewer;
