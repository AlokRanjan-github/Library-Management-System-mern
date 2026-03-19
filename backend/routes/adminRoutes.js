import express from 'express';
import {
  getAllStudents,
  getAllBorrowedBooks,
  getOverdueBooks,
  getAllCategories,
  updateStudent,
  deleteStudent,
  getReturnRequests,
  approveReturn,
} from '../controllers/adminController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth & admin middleware to all admin routes
router.use(authenticateUser, authorizeAdmin);

router.route('/students').get(getAllStudents);
router.route('/students/:id')
  .put(updateStudent)
  .delete(deleteStudent);

router.route('/borrowed-books').get(getAllBorrowedBooks);
router.route('/overdue').get(getOverdueBooks);
router.route('/categories').get(getAllCategories);

router.route('/returns/pending').get(getReturnRequests);
router.route('/returns/approve/:id').post(approveReturn);

export default router;
