import Book from '../models/Book.js';

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 1000;
    const page = Number(req.query.pageNumber) || 1;

    let keyword = {};
    if (req.query.keyword) {
      const { default: Category } = await import('../models/Category.js');
      const matchingCategories = await Category.find({
        name: { $regex: req.query.keyword, $options: 'i' }
      });
      const categoryIds = matchingCategories.map(cat => cat._id);

      keyword = {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
          { category: { $in: categoryIds } }
        ]
      };
    }

    const count = await Book.countDocuments({ ...keyword });
    const books = await Book.find({ ...keyword })
      .populate('category', 'name description')
      .sort({ createdAt: -1 }) // Show newest first
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ books, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving books' });
  }
};

// @desc    Get single book details
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving book' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const { title, author, category: categoryName, isbn, totalCopies } = req.body;

    // Check if book with ISBN already exists
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    // Handle Category: find by name or create new
    let categoryId;
    if (categoryName) {
      const { default: Category } = await import('../models/Category.js');
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });

      if (!category) {
        category = await Category.create({
          name: categoryName
        });
      }
      categoryId = category._id;
    }

    const book = new Book({
      title,
      author,
      category: categoryId,
      isbn,
      totalCopies,
      availableCopies: totalCopies, // Default to totalCopies
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating book' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const { title, author, category: categoryName, isbn, totalCopies } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
      // Handle Category: find by name or create new
      if (categoryName) {
        const { default: Category } = await import('../models/Category.js');
        let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });

        if (!category) {
          category = await Category.create({
            name: categoryName
          });
        }
        book.category = category._id;
      }

      // Sync available copies if totalCopies changes
      if (totalCopies !== undefined && totalCopies !== book.totalCopies) {
        const difference = totalCopies - book.totalCopies;
        book.availableCopies = Math.max(0, book.availableCopies + difference);
        book.totalCopies = totalCopies;
      }

      book.title = title || book.title;
      book.author = author || book.author;
      book.isbn = isbn || book.isbn;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating book' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if there are any active borrows for this book
    const Borrow = await importBorrowModel();
    const activeBorrows = await Borrow.countDocuments({ 
        bookId: book._id, 
        status: 'borrowed' 
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        message: `Cannot delete book. There are ${activeBorrows} active borrow(s). Please return them first.` 
      });
    }

    await Book.findByIdAndDelete(book._id);
    res.json({ message: 'Book removed successfully from library' });
  } catch (error) {
    console.error('DELETE BOOK ERROR:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};

// @desc    Borrow a book
// @route   POST /api/books/borrow
// @access  Private (Student/Admin)
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const studentId = req.user._id;

    // 1. Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 2. Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available right now' });
    }

    // 3. Prevent multiple active borrows of the same book
    importBorrowModel().then(async (Borrow) => {
      const existingBorrow = await Borrow.findOne({
        studentId,
        bookId,
        status: 'borrowed',
      });

      if (existingBorrow) {
        return res
          .status(400)
          .json({ message: 'You have already borrowed this book' });
      }

      // 4. Create Borrow Record
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days from today

      const borrowRecord = await Borrow.create({
        studentId,
        bookId,
        dueDate,
      });

      // 5. Reduce available copies
      book.availableCopies -= 1;
      await book.save();

      res.status(201).json({
        message: 'Book borrowed successfully',
        borrowRecord,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error logic borrowing book' });
  }
};

// Helper for dynamic import to avoid circular dependencies if any (or just direct import)
const importBorrowModel = async () => {
  const { default: Borrow } = await import('../models/Borrow.js');
  return Borrow;
}

// @desc    Return a book
// @route   POST /api/books/return
// @access  Private (Student/Admin)
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    importBorrowModel().then(async (Borrow) => {
      // 1. Find Borrow Record
      const borrowRecord = await Borrow.findById(borrowId);
      if (!borrowRecord) {
        return res.status(404).json({ message: 'Borrow record not found' });
      }

      if (borrowRecord.status === 'returned') {
        return res.status(400).json({ message: 'Book is already returned' });
      }

      // 2. Find associated book
      const book = await Book.findById(borrowRecord.bookId);

      // 3. Mark as pending return
      borrowRecord.status = 'pending_return';
      borrowRecord.returnDate = new Date(); // Request date

      await borrowRecord.save();

      res.status(200).json({
        message: 'Return request sent to admin for approval',
        borrowRecord,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error returning book' });
  }
};
