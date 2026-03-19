import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '../animations/AnimatedCard';
import FadeInSection from '../animations/FadeInSection';

const BooksTab = ({
  books,
  categories,
  showBookForm,
  setShowBookForm,
  editingBook,
  setEditingBook,
  bookFormData,
  setBookFormData,
  showCategoryList,
  setShowCategoryList,
  categoryRef,
  handleBookSubmit,
  handleDeleteBook,
  openEditForm
}) => {
  return (
    <FadeInSection>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Catalog</h2>
          <button
            onClick={() => {
              setEditingBook(null);
              setBookFormData({ title: '', author: '', isbn: '', totalCopies: 1, category: '' });
              setShowBookForm(!showBookForm);
            }}
            className="px-4 py-2 bg-primary hover:bg-blue-600 rounded-md transition-colors text-white text-sm font-semibold"
          >
            {showBookForm ? 'Cancel' : '+ Add New Book'}
          </button>
        </div>

        {showBookForm && (
          <AnimatedCard delay={0} className="bg-slate-700 p-6 rounded-lg mb-8 border border-slate-600">
            <h3 className="text-lg font-bold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleBookSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" required value={bookFormData.title} onChange={e => setBookFormData({ ...bookFormData, title: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <input type="text" placeholder="Author" required value={bookFormData.author} onChange={e => setBookFormData({ ...bookFormData, author: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <input type="text" placeholder="ISBN" required value={bookFormData.isbn} onChange={e => setBookFormData({ ...bookFormData, isbn: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <input type="number" placeholder="Total Copies" min="1" required value={bookFormData.totalCopies} onChange={e => setBookFormData({ ...bookFormData, totalCopies: parseInt(e.target.value) })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <div className="relative group" ref={categoryRef}>
                <input
                  type="text"
                  placeholder="Category (Search or Type New)"
                  required
                  value={bookFormData.category}
                  onChange={e => {
                    setBookFormData({ ...bookFormData, category: e.target.value });
                    setShowCategoryList(true);
                  }}
                  onFocus={() => setShowCategoryList(true)}
                  className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white pr-10"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showCategoryList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <AnimatePresence>
                  {showCategoryList && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl"
                    >
                      {categories
                        .filter(cat => cat.name.toLowerCase().includes(bookFormData.category.toLowerCase()))
                        .map(cat => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => {
                              setBookFormData({ ...bookFormData, category: cat.name });
                              setShowCategoryList(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border-b border-slate-700/50 last:border-0 flex items-center justify-between"
                          >
                            <span>{cat.name}</span>
                            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-500">Existing</span>
                          </button>
                        ))}
                      {bookFormData.category && !categories.find(cat => cat.name.toLowerCase() === bookFormData.category.toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => setShowCategoryList(false)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/20 text-accent font-medium transition-colors"
                        >
                          Create new: "{bookFormData.category}"
                        </button>
                      )}
                      {categories.filter(cat => cat.name.toLowerCase().includes(bookFormData.category.toLowerCase())).length === 0 && !bookFormData.category && (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">
                          Start typing to see categories...
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-secondary hover:bg-purple-600 text-white font-semibold rounded-md transition-colors">
                  {editingBook ? 'Update Book' : 'Save Book'}
                </button>
              </div>
            </form>
          </AnimatedCard>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Stock (Avail/Total)</th>
                <th className="p-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {books.map(book => (
                <tr key={book._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-white font-medium">{book.title}</td>
                  <td className="p-4 text-slate-300">{book.author}</td>
                  <td className="p-4 text-slate-400">
                    <span className="bg-slate-700/50 px-2 py-1 rounded text-xs">
                      {book.category?.name || book.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-sm">{book.isbn}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${book.availableCopies > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditForm(book)} className="text-secondary hover:text-purple-400 mr-4 text-sm font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDeleteBook(book._id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan="6" className="p-4 text-center text-slate-400">No books found in catalog.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FadeInSection>
  );
};

export default BooksTab;
