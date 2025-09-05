import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api';
import { Quiz, Question } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import QuestionCard from './QuestionCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface Props {
  navigation: any;
  route: { params: { courseId: string } };
}

const QuizScreen: React.FC<Props> = ({ navigation, route }) => {
  const { courseId } = route.params;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getQuiz(courseId);
      setQuiz(response.quiz);
      setTimeLeft(response.quiz.questions.length * 60); // 1 minute per question
      setAnswers(new Array(response.quiz.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      Alert.alert('Error', 'Failed to load quiz');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const response = await ApiService.submitQuiz(courseId, answers, timeTaken);
      navigation.navigate('QuizResult', { 
        result: response.result,
        courseId 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner text="Loading quiz..." />;
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Quiz not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentQuestion + 1} / {quiz.questions.length}
        </Text>
        <Text style={[styles.timer, timeLeft < 60 && styles.timerWarning]}>
          <Ionicons name="time-outline" size={16} />
          {formatTime(timeLeft)}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }
          ]}
        />
      </View>

      <QuestionCard
        question={quiz.questions[currentQuestion]}
        selectedAnswer={answers[currentQuestion]}
        onAnswerSelect={handleAnswerSelect}
      />

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            answers[currentQuestion] === -1 && styles.navButtonDisabled
          ]}
          onPress={handleNext}
          disabled={answers[currentQuestion] === -1}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface
  },
  progress: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: 'bold'
  },
  timer: {
    ...FONTS.body3,
    color: COLORS.primary
  },
  timerWarning: {
    color: COLORS.error
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface
  },
  navButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base,
    backgroundColor: COLORS.border
  },
  navButtonDisabled: {
    backgroundColor: COLORS.disabled
  },
  nextButton: {
    backgroundColor: COLORS.primary
  },
  navButtonText: {
    ...FONTS.body3,
    color: COLORS.text
  },
  nextButtonText: {
    ...FONTS.body3,
    color: '#fff',
    fontWeight: 'bold'
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 50
  }
});

export default QuizScreen;
