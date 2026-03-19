import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { bookService, studentService } from '../services/api';
import BookCard from '../components/BookCard';
import PageTransition from '../components/animations/PageTransition';
import { FaSearch, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('role');

  const fetchBooks = useCallback(async () => {
    try {
      // 1. Fetch Catalog (This is public and should not fail if not logged in)
      const booksData = await bookService.getBooks(searchTerm);
      setBooks(booksData.books);
      
      // 2. Fetch User-specific info if logged in as student
      if (role === 'student') {
        try {
          const borrowedData = await studentService.getBorrowedBooks();
          if (borrowedData && Array.isArray(borrowedData)) {
            const activeBorrowedIds = new Set(
              borrowedData
                .filter(b => b.status === 'borrowed' || b.status === 'pending_return')
                .map(b => b.bookId?._id || b.bookId)
            );
            setBorrowedBookIds(activeBorrowedIds);
          }
        } catch (borrowErr) {
          // If fetching borrowed books fails (e.g., token expired), we still show the catalog
          console.warn('Session check failed, showing standard catalog.', borrowErr);
        }
      }
    } catch (err) {
      toast.error('Failed to load the library catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, role]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBorrow = async (bookId) => {
    try {
      await bookService.borrowBook(bookId);
      toast.success('Book borrowed successfully! Check your dashboard.');
      fetchBooks(); // Refresh book list to update available copies
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    }
  };

  return (
    <PageTransition className="bg-dark min-h-screen text-slate-200 pb-20">
      
      {/* Header Section */}
      <div className="bg-slate-900 border-b border-slate-800 pt-10 pb-8 px-4 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Library Catalog</h1>
              <p className="text-lg text-slate-400">Discover and borrow from our extensive collection of books.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-500 transition-all shadow-inner"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Alerts have been replaced by Toasts */}

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : books.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {books.map((book) => (
              <BookCard 
                key={book._id} 
                book={book} 
                onBorrow={handleBorrow} 
                isAlreadyBorrowed={borrowedBookIds.has(book._id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed"
          >
            <FaBookOpen className="mx-auto text-6xl text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No books found</h3>
            <p className="text-slate-500">Try adjusting your search terms or browse later.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default BrowseBooks;
