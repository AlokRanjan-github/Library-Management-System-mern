import { motion } from 'framer-motion';
import { FaBookOpen, FaUserAstronaut, FaShapes, FaLayerGroup } from 'react-icons/fa';

const BookCard = ({ book, onBorrow }) => {
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
              isAvailable ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isAvailable ? `${book.availableCopies} Available` : 'Out of Stock'}
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
        <div className="mt-6 pt-4 border-t border-slate-700 hidden">
          {/* Note: In BrowseBooks we handle the borrow button dynamically */}
        </div>
      )}

      {role === 'student' && (
        <button
          onClick={() => onBorrow(book._id)}
          disabled={!isAvailable}
          className={`mt-6 w-full py-3 px-4 rounded-xl font-bold transition-all ${
            isAvailable 
              ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-primary/25 transform hover:-translate-y-1' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
          }`}
        >
          {isAvailable ? 'Borrow Book' : 'Unavailable'}
        </button>
      )}
    </motion.div>
  );
};

export default BookCard;
