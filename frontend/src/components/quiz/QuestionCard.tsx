import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Question } from '../../types';
import { COLORS, SIZES, FONTS } from '../../utils/constants';

interface Props {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (index: number) => void;
  showExplanation?: boolean;
  correctAnswer?: number;
}

const QuestionCard: React.FC<Props> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation = false,
  correctAnswer
}) => {
  const getOptionStyle = (index: number) => {
    if (showExplanation) {
      if (index === correctAnswer) {
        return [styles.option, styles.correctOption];
      } else if (index === selectedAnswer && index !== correctAnswer) {
        return [styles.option, styles.incorrectOption];
      }
    }
    return [
      styles.option,
      selectedAnswer === index && styles.selectedOption
    ];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>
      
      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => !showExplanation && onAnswerSelect(index)}
            disabled={showExplanation}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionNumber,
                selectedAnswer === index && styles.selectedOptionNumber,
                showExplanation && index === correctAnswer && styles.correctOptionNumber,
                showExplanation && index === selectedAnswer && index !== correctAnswer && styles.incorrectOptionNumber
              ]}>
                <Text style={[
                  styles.optionNumberText,
                  selectedAnswer === index && styles.selectedOptionNumberText,
                  showExplanation && index === correctAnswer && styles.correctOptionNumberText,
                  showExplanation && index === selectedAnswer && index !== correctAnswer && styles.incorrectOptionNumberText
                ]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                showExplanation && index === correctAnswer && styles.correctOptionText,
                showExplanation && index === selectedAnswer && index !== correctAnswer && styles.incorrectOptionText
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {showExplanation && (
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding
  },
  question: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    lineHeight: 28
  },
  options: {
    flex: 1
  },
  option: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    padding: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.border
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`
  },
  correctOption: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}10`
  },
  incorrectOption: {
    borderColor: COLORS.error,
    backgroundColor: `${COLORS.error}10`
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base
  },
  selectedOptionNumber: {
    backgroundColor: COLORS.primary
  },
  correctOptionNumber: {
    backgroundColor: COLORS.success
  },
  incorrectOptionNumber: {
    backgroundColor: COLORS.error
  },
  optionNumberText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    fontWeight: 'bold'
  },
  selectedOptionNumberText: {
    color: '#fff'
  },
  correctOptionNumberText: {
    color: '#fff'
  },
  incorrectOptionNumberText: {
    color: '#fff'
  },
  optionText: {
    ...FONTS.body3,
    color: COLORS.text,
    flex: 1
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '500'
  },
  correctOptionText: {
    color: COLORS.success,
    fontWeight: '500'
  },
  incorrectOptionText: {
    color: COLORS.error,
    fontWeight: '500'
  },
  explanation: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.margin,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info
  },
  explanationTitle: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.base
  },
  explanationText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    lineHeight: 20
  }
});

export default QuestionCard;
