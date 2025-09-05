import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizResult } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';

interface Props {
  navigation: any;
  route: { params: { result: QuizResult; courseId: string } };
}

const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { result, courseId } = route.params;

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.warning;
    return COLORS.error;
  };

  const getResultIcon = (passed: boolean) => {
    return passed ? 'checkmark-circle' : 'close-circle';
  };

  const getResultMessage = (passed: boolean, score: number) => {
    if (passed) {
      if (score >= 90) return 'Excellent work! You\'ve mastered this topic.';
      if (score >= 80) return 'Great job! You have a solid understanding.';
      return 'Well done! You\'ve passed the quiz.';
    }
    return 'Don\'t worry, keep learning and try again!';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.score, { color: getScoreColor(result.score) }]}>
            {result.score}%
          </Text>
          <Ionicons
            name={getResultIcon(result.passed)}
            size={48}
            color={result.passed ? COLORS.success : COLORS.error}
            style={styles.resultIcon}
          />
        </View>
        
        <Text style={styles.resultMessage}>
          {getResultMessage(result.passed, result.score)}
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{result.correctAnswers}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{result.totalQuestions - result.correctAnswers}</Text>
          <Text style={styles.statLabel}>Incorrect</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatTime(result.timeTaken)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
      </View>

      {result.incorrectAnswers.length > 0 && (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>Review Incorrect Answers</Text>
          {result.incorrectAnswers.map((question, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewQuestion}>{question.question}</Text>
              <View style={styles.reviewAnswers}>
                <Text style={styles.reviewLabel}>Your answer:</Text>
                <Text style={styles.incorrectAnswer}>{question.options[question.userAnswer]}</Text>
                <Text style={styles.reviewLabel}>Correct answer:</Text>
                <Text style={styles.correctAnswer}>{question.options[question.correctAnswer]}</Text>
              </View>
              {question.explanation && (
                <Text style={styles.reviewExplanation}>{question.explanation}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {result.passed ? (
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={() => navigation.navigate('Course', { courseId })}
          >
            <Text style={styles.buttonText}>Continue Learning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.surface
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin
  },
  score: {
    ...FONTS.h1,
    fontWeight: 'bold'
  },
  resultIcon: {
    position: 'absolute',
    top: -10,
    right: -10
  },
  resultMessage: {
    ...FONTS.body2,
    color: COLORS.text,
    textAlign: 'center'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginTop: SIZES.margin
  },
  statCard: {
    alignItems: 'center'
  },
  statNumber: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: 4
  },
  review: {
    margin: SIZES.margin,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding
  },
  reviewTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin
  },
  reviewItem: {
    marginBottom: SIZES.margin,
    paddingBottom: SIZES.margin,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  reviewQuestion: {
    ...FONTS.body3,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  reviewAnswers: {
    marginBottom: SIZES.base
  },
  reviewLabel: {
    ...FONTS.body4,
    color: COLORS.textLight,
    fontWeight: 'bold'
  },
  incorrectAnswer: {
    ...FONTS.body3,
    color: COLORS.error,
    marginBottom: SIZES.base
  },
  correctAnswer: {
    ...FONTS.body3,
    color: COLORS.success
  },
  reviewExplanation: {
    ...FONTS.body4,
    color: COLORS.textLight,
    fontStyle: 'italic'
  },
  actions: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2
  },
  button: {
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    marginBottom: SIZES.base
  },
  continueButton: {
    backgroundColor: COLORS.success
  },
  retryButton: {
    backgroundColor: COLORS.primary
  },
  homeButton: {
    backgroundColor: COLORS.textLight
  },
  buttonText: {
    ...FONTS.body3,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default ResultScreen;
