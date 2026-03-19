import express from 'express';
import {
  getAvailableBooks,
  getBorrowedBooks,
  getStudentFines,
} from '../controllers/studentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All student routes require authentication
router.use(authenticateUser);

router.route('/books').get(getAvailableBooks);
router.route('/borrowed').get(getBorrowedBooks);
router.route('/fines').get(getStudentFines);

export default router;
