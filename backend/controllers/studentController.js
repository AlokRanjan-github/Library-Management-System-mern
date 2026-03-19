import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';

// @desc    View available books
// @route   GET /api/student/books
// @access  Private (Student)
export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ availableCopies: { $gt: 0 } }).populate(
      'category',
      'name description'
    );
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving available books' });
  }
};

// @desc    View books borrowed by logged in student
// @route   GET /api/student/borrowed
// @access  Private (Student)
export const getBorrowedBooks = async (req, res) => {
  try {
    const borrows = await Borrow.find({ studentId: req.user._id })
      .populate('bookId', 'title author isbn coverImage')
      .sort({ createdAt: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving borrowed books' });
  }
};

// @desc    View due amount / fines
// @route   GET /api/student/fines
// @access  Private (Student)
export const getStudentFines = async (req, res) => {
  try {
    const borrows = await Borrow.find({ studentId: req.user._id });

    let totalFine = 0;
    const unpaidFinesDetails = [];

    borrows.forEach((borrow) => {
      let fineForThisRecord = borrow.fineAmount;

      // Also calculate potential fine for books not yet returned but overdue
      if (borrow.status === 'borrowed') {
        const now = new Date();
        if (now > borrow.dueDate) {
          const diffTime = Math.abs(now - borrow.dueDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          fineForThisRecord += diffDays * 50; // INR 50/day
        }
      } else if (borrow.status === 'pending_return') {
        // use request date for final "potential" calculation for the user
        if (borrow.returnDate > borrow.dueDate) {
           const diffTime = Math.abs(borrow.returnDate - borrow.dueDate);
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           fineForThisRecord += diffDays * 50;
        }
      }

      if (fineForThisRecord > 0) {
        totalFine += fineForThisRecord;
        unpaidFinesDetails.push({
          bookId: borrow.bookId,
          dueDate: borrow.dueDate,
          fineAmount: fineForThisRecord,
          status: borrow.status,
        });
      }
    });

    res.json({
      currency: 'INR',
      totalFine,
      details: unpaidFinesDetails,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error calculating fines' });
  }
};
