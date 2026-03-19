import Book from '../models/Book.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Borrow from '../models/Borrow.js';

export const getLibraryStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCategories = await Category.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ status: 'borrowed' });
    
    // Get latest 3 books as "New Arrivals"
    const latestBooks = await Book.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      stats: [
        { label: 'Total Books', value: `${totalBooks}+` },
        { label: 'Total Categories', value: totalCategories },
        { label: 'Active Students', value: `${totalStudents}+` },
        { label: 'Borrowed Books', value: activeBorrows }
      ],
      latestBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching library stats' });
  }
};
