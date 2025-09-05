import { Request, Response } from 'express';
import Quiz, { IQuiz } from '../models/Quiz';
import Course from '../models/Course';
import User from '../models/User';
import { TranslationService } from '../services/translationService';

const translationService = new TranslationService();

export class QuizController {
  async getQuiz(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const { language = 'en' } = req.query;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      let quiz = course.quiz;

      // Translate quiz if language is not English
      if (language !== 'en') {
        const translatedQuestions = await Promise.all(
          quiz.questions.map(async (question) => {
            const translatedQuestion = await translationService.translateText({
              text: question.question,
              targetLanguage: language as string
            });

            const translatedOptions = await Promise.all(
              question.options.map(option =>
                translationService.translateText({
                  text: option,
                  targetLanguage: language as string
                })
              )
            );

            const translatedExplanation = await translationService.translateText({
              text: question.explanation,
              targetLanguage: language as string
            });

            return {
              ...question,
              question: translatedQuestion.translatedText,
              options: translatedOptions.map(t => t.translatedText),
              explanation: translatedExplanation.translatedText
            };
          })
        );

        quiz = {
          ...quiz,
          questions: translatedQuestions
        };
      }

      res.json({ quiz });
    } catch (error) {
      console.error('Get quiz error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async submitQuiz(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { courseId, answers, timeTaken } = req.body;

      const user = await User.findById(userId);
      const course = await Course.findById(courseId);

      if (!user || !course) {
        return res.status(404).json({ message: 'User or course not found' });
      }

      const quiz = course.quiz;
      const questions = quiz.questions;

      // Calculate score
      let correctAnswers = 0;
      const incorrectQuestions: any[] = [];

      answers.forEach((answer: number, index: number) => {
        if (questions[index].correctAnswer === answer) {
          correctAnswers++;
        } else {
          incorrectQuestions.push({
            ...questions[index],
            userAnswer: answer,
            questionIndex: index
          });
        }
      });

      const score = Math.round((correctAnswers / questions.length) * 100);
      const passed = score >= quiz.passingScore;

      // Save quiz attempt
      const quizAttempt = new Quiz({
        userId,
        courseId,
        answers,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeTaken,
        passed,
        attemptDate: new Date()
      });

      await quizAttempt.save();

      // Update user progress if passed
      if (passed) {
        const pointsEarned = 100;
        user.progress.totalPoints += pointsEarned;

        // Check if course is already completed
        const alreadyCompleted = user.progress.coursesCompleted.includes(courseId);
        if (!alreadyCompleted) {
          user.progress.coursesCompleted.push(courseId);
          user.progress.totalPoints += 200; // Bonus for course completion
          
          // Add achievement
          const achievementName = `Completed ${course.title}`;
          if (!user.progress.achievements.includes(achievementName)) {
            user.progress.achievements.push(achievementName);
          }

          // Level up check
          const newLevel = Math.floor(user.progress.totalPoints / 1000) + 1;
          if (newLevel > user.progress.currentLevel) {
            user.progress.currentLevel = newLevel;
            user.progress.achievements.push(`Reached Level ${newLevel}`);
          }
        }

        await user.save();
      }

      res.json({
        message: passed ? 'Quiz completed successfully!' : 'Quiz completed. Try again to pass.',
        result: {
          score,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectQuestions: incorrectQuestions.map(q => ({
            question: q.question,
            correctAnswer: q.options[q.correctAnswer],
            userAnswer: q.options[q.userAnswer],
            explanation: q.explanation
          })),
          timeTaken,
          passed,
          pointsEarned: passed ? (alreadyCompleted ? 100 : 300) : 0,
          totalPoints: user.progress.totalPoints,
          currentLevel: user.progress.currentLevel
        }
      });
    } catch (error) {
      console.error('Submit quiz error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getQuizHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { courseId } = req.params;

      const quizHistory = await Quiz.find({ 
        userId, 
        ...(courseId && { courseId })
      })
      .populate('courseId', 'title')
      .sort({ attemptDate: -1 })
      .limit(10);

      res.json({ history: quizHistory });
    } catch (error) {
      console.error('Get quiz history error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getQuizStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const stats = await Quiz.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            totalPassed: { $sum: { $cond: ['$passed', 1, 0] } },
            averageScore: { $avg: '$score' },
            bestScore: { $max: '$score' },
            totalTimeTaken: { $sum: '$timeTaken' }
          }
        }
      ]);

      const result = stats.length > 0 ? stats[0] : {
        totalAttempts: 0,
        totalPassed: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeTaken: 0
      };

      res.json({ stats: result });
    } catch (error) {
      console.error('Get quiz stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
