import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} from '../controllers/bookController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for viewing books
router.route('/').get(getBooks);

// Protected routes (Admin only) for modifying books
router.route('/')
  .post(authenticateUser, authorizeAdmin, createBook);

router.route('/:id')
  .get(getBookById)
  .put(authenticateUser, authorizeAdmin, updateBook)
  .delete(authenticateUser, authorizeAdmin, deleteBook);
// Protected routes (Student/Admin) for borrowing mechanics
router.route('/borrow').post(authenticateUser, borrowBook);
router.route('/return').post(authenticateUser, returnBook);

export default router;
