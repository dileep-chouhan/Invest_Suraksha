import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Quiz from '../models/Quiz';
import Translation from '../models/Translation';

export class AnalyticsController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const [
        totalUsers,
        totalCourses,
        totalQuizzes,
        totalTranslations,
        activeUsers
      ] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments({ isActive: true }),
        Quiz.countDocuments(),
        Translation.countDocuments(),
        User.countDocuments({ 
          updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
        })
      ]);

      res.json({
        totalUsers,
        totalCourses,
        totalQuizzes,
        totalTranslations,
        activeUsers
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserAnalytics(req: Request, res: Response) {
    try {
      // User registration over time
      const userRegistrations = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // User demographics
      const languageDistribution = await User.aggregate([
        {
          $group: {
            _id: '$preferredLanguage',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const experienceDistribution = await User.aggregate([
        {
          $group: {
            _id: '$profile.investmentExperience',
            count: { $sum: 1 }
          }
        }
      ]);

      const riskToleranceDistribution = await User.aggregate([
        {
          $group: {
            _id: '$profile.riskTolerance',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        userRegistrations,
        languageDistribution,
        experienceDistribution,
        riskToleranceDistribution
      });
    } catch (error) {
      console.error('Get user analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCourseAnalytics(req: Request, res: Response) {
    try {
      // Most popular courses
      const popularCourses = await User.aggregate([
        { $unwind: '$progress.coursesCompleted' },
        {
          $group: {
            _id: '$progress.coursesCompleted',
            completions: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'course'
          }
        },
        {
          $unwind: '$course'
        },
        {
          $project: {
            title: '$course.title',
            category: '$course.category',
            difficulty: '$course.difficulty',
            completions: 1
          }
        },
        {
          $sort: { completions: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Course completion rates by difficulty
      const completionsByDifficulty = await Course.aggregate([
        {
          $lookup: {
            from: 'users',
            let: { courseId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$$courseId', '$progress.coursesCompleted']
                  }
                }
              },
              {
                $count: 'completions'
              }
            ],
            as: 'completionData'
          }
        },
        {
          $group: {
            _id: '$difficulty',
            totalCourses: { $sum: 1 },
            totalCompletions: {
              $sum: {
                $ifNull: [{ $arrayElemAt: ['$completionData.completions', 0] }, 0]
              }
            }
          }
        }
      ]);

      res.json({
        popularCourses,
        completionsByDifficulty
      });
    } catch (error) {
      console.error('Get course analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getQuizAnalytics(req: Request, res: Response) {
    try {
      // Quiz performance stats
      const quizStats = await Quiz.aggregate([
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            totalPassed: { $sum: { $cond: ['$passed', 1, 0] } },
            averageScore: { $avg: '$score' },
            averageTime: { $avg: '$timeTaken' }
          }
        }
      ]);

      // Quiz attempts over time
      const quizAttempts = await Quiz.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$attemptDate' },
              month: { $month: '$attemptDate' }
            },
            attempts: { $sum: 1 },
            passed: { $sum: { $cond: ['$passed', 1, 0] } }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // Score distribution
      const scoreDistribution = await Quiz.aggregate([
        {
          $bucket: {
            groupBy: '$score',
            boundaries: [0, 25, 50, 75, 100],
            default: 'Other',
            output: {
              count: { $sum: 1 }
            }
          }
        }
      ]);

      res.json({
        quizStats: quizStats[0] || {
          totalAttempts: 0,
          totalPassed: 0,
          averageScore: 0,
          averageTime: 0
        },
        quizAttempts,
        scoreDistribution
      });
    } catch (error) {
      console.error('Get quiz analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTradingAnalytics(req: Request, res: Response) {
    try {
      // Portfolio statistics
      const portfolioStats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            averagePortfolioValue: { $avg: '$virtualPortfolio.totalValue' },
            totalCashDeployed: {
              $avg: { $subtract: [1000000, '$virtualPortfolio.cash'] }
            },
            profitableUsers: {
              $sum: { $cond: [{ $gt: ['$virtualPortfolio.totalGainLoss', 0] }, 1, 0] }
            }
          }
        }
      ]);

      // Most traded stocks
      const stockHoldings = await User.aggregate([
        { $unwind: '$virtualPortfolio.holdings' },
        {
          $group: {
            _id: '$virtualPortfolio.holdings.symbol',
            totalQuantity: { $sum: '$virtualPortfolio.holdings.quantity' },
            uniqueHolders: { $sum: 1 },
            averagePrice: { $avg: '$virtualPortfolio.holdings.averagePrice' }
          }
        },
        {
          $sort: { uniqueHolders: -1 }
        },
        {
          $limit: 10
        }
      ]);

      res.json({
        portfolioStats: portfolioStats[0] || {
          totalUsers: 0,
          averagePortfolioValue: 0,
          totalCashDeployed: 0,
          profitableUsers: 0
        },
        stockHoldings
      });
    } catch (error) {
      console.error('Get trading analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getLanguageAnalytics(req: Request, res: Response) {
    try {
      // Translation usage by language
      const translationUsage = await Translation.aggregate([
        {
          $group: {
            _id: {
              targetLanguage: '$targetLanguage',
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$timestamp'
                }
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.date': 1 }
        }
      ]);

      // Most translated languages
      const languagePopularity = await Translation.aggregate([
        {
          $group: {
            _id: '$targetLanguage',
            totalTranslations: { $sum: 1 },
            lastUsed: { $max: '$timestamp' }
          }
        },
        {
          $sort: { totalTranslations: -1 }
        }
      ]);

      res.json({
        translationUsage,
        languagePopularity
      });
    } catch (error) {
      console.error('Get language analytics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
