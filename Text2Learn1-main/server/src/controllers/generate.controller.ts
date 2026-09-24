/**
 * AI Generation Controller
 * Handles course and lesson generation using Gemini API
 */

import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import { generateCourseOutline, generateLessonContent } from '../services/gemini.service';

/**
 * Generate a course outline from a topic
 */
export const generateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { topic, moduleCount = 5, lessonCount = 4 } = req.body;

    console.log(`Generating course for topic: "${topic}"`);

    // Generate course outline using Gemini
    const courseOutline = await generateCourseOutline(topic, moduleCount, lessonCount);

    res.status(200).json({
      success: true,
      data: courseOutline,
      message: 'Course generated successfully'
    });
  } catch (error) {
    console.error('Generate course error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate course'
    });
  }
};

/**
 * Generate detailed lesson content
 */
export const generateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { courseTitle, moduleTitle, lessonTitle, previousLessons = [] } = req.body;

    console.log(`Generating lesson: "${lessonTitle}" for module: "${moduleTitle}"`);

    // Generate lesson content using Gemini
    const lessonContent = await generateLessonContent(
      courseTitle,
      moduleTitle,
      lessonTitle,
      previousLessons
    );

    res.status(200).json({
      success: true,
      data: lessonContent,
      message: 'Lesson generated successfully'
    });
  } catch (error) {
    console.error('Generate lesson error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate lesson'
    });
  }
};
