import { motion } from 'framer-motion';
import { FaBookOpen, FaUserAstronaut, FaShapes, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookCard = ({ book, onBorrow, isAlreadyBorrowed }) => {
  const role = localStorage.getItem('role');
  const isAvailable = book.availableCopies > 0;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-accent/50 rounded-2xl p-6 shadow-xl flex flex-col h-full"
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
            <FaBookOpen className="text-3xl text-primary" />
          </div>
          <span 
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isAlreadyBorrowed 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : isAvailable 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isAlreadyBorrowed ? 'Already Borrowed' : isAvailable ? `${book.availableCopies} Available` : 'Out of Stock'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        
        <div className="space-y-2 mt-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <FaUserAstronaut className="text-accent" />
            <span className="truncate">{book.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaShapes className="text-secondary" />
            <span className="truncate">{book.category?.name || book.category || 'Uncategorized'}</span>
          </div>
          <div className="flex items-center space-x-2 border-t border-slate-700/50 pt-2 mt-2">
             <FaLayerGroup className="text-slate-500" />
             <span>Total Copies: {book.totalCopies}</span>
          </div>
        </div>
      </div>

      {role === 'student' && (
        <button
          onClick={() => {
            if (isAlreadyBorrowed) {
              toast.info('You have already borrowed this book. Check your dashboard!');
              return;
            }
            onBorrow(book._id);
          }}
          disabled={!isAvailable && !isAlreadyBorrowed}
          className={`mt-6 w-full py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
            isAlreadyBorrowed
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-1'
              : isAvailable 
                ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-primary/25 transform hover:-translate-y-1' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
          }`}
        >
          {isAlreadyBorrowed ? 'Already Borrowed' : isAvailable ? 'Borrow Book' : 'Unavailable'}
        </button>
      )}
    </motion.div>
  );
};

export default BookCard;
