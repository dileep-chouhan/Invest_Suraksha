import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import { TranslationService } from '../services/translationService';
import User from '../models/User';

const translationService = new TranslationService();

export class CourseController {
  async getCourses(req: Request, res: Response) {
    try {
      const { language = 'en', category, difficulty } = req.query;
      
      let query: any = { isActive: true };
      
      if (category) {
        query.category = category;
      }
      
      if (difficulty) {
        query.difficulty = difficulty;
      }

      const courses = await Course.find(query);

      // If language is not English, translate courses
      if (language !== 'en') {
        const translatedCourses = await Promise.all(
          courses.map(course => 
            translationService.translateCourse(course.toObject(), language as string)
          )
        );
        return res.json({ courses: translatedCourses });
      }

      res.json({ courses });
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { language = 'en' } = req.query;

      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // If language is not English, translate course
      if (language !== 'en') {
        const translatedCourse = await translationService.translateCourse(
          course.toObject(), 
          language as string
        );
        return res.json({ course: translatedCourse });
      }

      res.json({ course });
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async markLessonComplete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { courseId, lessonIndex } = req.body;

      const user = await User.findById(userId);
      const course = await Course.findById(courseId);

      if (!user || !course) {
        return res.status(404).json({ message: 'User or course not found' });
      }

      // Add points for completing lesson
      const pointsEarned = 50;
      user.progress.totalPoints += pointsEarned;

      // Check if all lessons are completed
      const totalLessons = course.lessons.length;
      const completedLessons = user.progress.coursesCompleted.filter(
        (completedCourseId: any) => completedCourseId.toString() === courseId
      ).length;

      if (completedLessons + 1 === totalLessons) {
        // Course completed
        user.progress.coursesCompleted.push(courseId);
        user.progress.totalPoints += 200; // Bonus points for course completion
        
        // Add achievement
        const achievementName = `Completed ${course.title}`;
        if (!user.progress.achievements.includes(achievementName)) {
          user.progress.achievements.push(achievementName);
        }

        // Level up check
        const newLevel = Math.floor(user.progress.totalPoints / 1000) + 1;
        if (newLevel > user.progress.currentLevel) {
          user.progress.currentLevel = newLevel;
        }
      }

      await user.save();

      res.json({
        message: 'Lesson marked as complete',
        pointsEarned,
        totalPoints: user.progress.totalPoints,
        currentLevel: user.progress.currentLevel,
        achievements: user.progress.achievements
      });
    } catch (error) {
      console.error('Mark lesson complete error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await User.findById(userId).populate('progress.coursesCompleted');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        progress: user.progress,
        achievements: user.progress.achievements,
        currentLevel: user.progress.currentLevel,
        totalPoints: user.progress.totalPoints
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
