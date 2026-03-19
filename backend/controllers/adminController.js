import User from '../models/User.js';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';

// @desc    View all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving students' });
  }
};

// @desc    View all borrowed books
// @route   GET /api/admin/borrowed-books
// @access  Private/Admin
export const getAllBorrowedBooks = async (req, res) => {
  try {
    const borrows = await Borrow.find({ status: 'borrowed' })
      .populate('studentId', 'name email course')
      .populate('bookId', 'title isbn author')
      .sort({ borrowDate: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving borrowed books' });
  }
};

// @desc    View overdue books
// @route   GET /api/admin/overdue
// @access  Private/Admin
export const getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();

    // Find all 'borrowed' records where the dueDate is strictly in the past
    const overdueBorrows = await Borrow.find({
      status: 'borrowed',
      dueDate: { $lt: now },
    })
      .populate('studentId', 'name email course')
      .populate('bookId', 'title isbn author')
      .sort({ dueDate: 1 });

    const overdueWithCalculatedFines = overdueBorrows.map((borrow) => {
      const diffTime = Math.abs(now - borrow.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const currentFine = diffDays * 50; // ₹50 per day (INR)

      return {
        _id: borrow._id,
        student: borrow.studentId,
        book: borrow.bookId,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        daysOverdue: diffDays,
        currentFine: currentFine,
        currency: 'INR',
      };
    });

    res.json(overdueWithCalculatedFines);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving overdue books' });
  }
};

// @desc    Get all categories for selection
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getAllCategories = async (req, res) => {
  try {
    const { default: Category } = await import('../models/Category.js');
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving categories' });
  }
};

// @desc    Update student profile
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'student') {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.course = req.body.course || user.course;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        course: updatedUser.course,
      });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'student') {
      // Check for active borrows before deleting
      const activeBorrows = await Borrow.findOne({ studentId: user._id, status: 'borrowed' });
      if (activeBorrows) {
        return res.status(400).json({ message: 'Cannot delete student with active borrowed books' });
      }

      await User.deleteOne({ _id: user._id });
      // Also clean up all returned borrow history
      await Borrow.deleteMany({ studentId: user._id });
      
      res.json({ message: 'Student and history deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    View pending return requests
// @route   GET /api/admin/returns/pending
// @access  Private/Admin
export const getReturnRequests = async (req, res, next) => {
  try {
    const requests = await Borrow.find({ status: 'pending_return' })
      .populate('studentId', 'name email course')
      .populate('bookId', 'title isbn author')
      .sort({ returnDate: 1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a book return
// @route   POST /api/admin/returns/approve/:id
// @access  Private/Admin
export const approveReturn = async (req, res, next) => {
  try {
    const borrowRecord = await Borrow.findById(req.params.id);

    if (borrowRecord && borrowRecord.status === 'pending_return') {
      const book = await Book.findById(borrowRecord.bookId);

      // 1. Mark as returned officially
      borrowRecord.status = 'returned';
      borrowRecord.returnDate = new Date(); // Finalized date

      // 2. Finalize fine calculation at approval time
      if (borrowRecord.returnDate > borrowRecord.dueDate) {
        const diffTime = Math.abs(borrowRecord.returnDate - borrowRecord.dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        borrowRecord.fineAmount = diffDays * 50; // ₹50 per day
      }

      await borrowRecord.save();

      // 3. Increase available copies
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      res.json({ message: 'Return approved and catalog updated', borrowRecord });
    } else {
      res.status(404).json({ message: 'Pending return request not found' });
    }
  } catch (error) {
    next(error);
  }
};
