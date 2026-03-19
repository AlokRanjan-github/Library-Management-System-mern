import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/animations/PageTransition';
import AnimatedCard from '../components/animations/AnimatedCard';
import { studentService, bookService, authService } from '../services/api';
import FadeInSection from '../components/animations/FadeInSection';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [borrowed, setBorrowed] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [fines, setFines] = useState({ totalFine: 0, details: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [borrowedData, finesData, booksData] = await Promise.all([
        studentService.getBorrowedBooks(),
        studentService.getFines(),
        studentService.getAvailableBooks()
      ]);
      setBorrowed(borrowedData);
      setFines(finesData);
      setAvailableBooks(booksData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to fetch dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleBorrow = async (bookId) => {
    try {
      await bookService.borrowBook(bookId);
      // Refresh list to update available copies and borrowed list
      fetchDashboardData();
      toast.success('Book borrowed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await bookService.returnBook(borrowId);
      fetchDashboardData();
      toast.success('Return request sent! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-dark text-white p-8">Loading Dashboard...</div>;
  
  return (
    <PageTransition className="bg-dark p-8 md:p-12 text-light min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-accent">Student Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/books')} className="px-4 py-2 bg-primary hover:bg-blue-600 rounded-md transition-colors text-white text-sm font-semibold">
            Browse Books
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-white text-sm font-semibold">
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <AnimatedCard delay={0.1} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-white">Active Borrows</h2>
          <p className="text-4xl font-bold text-accent mb-2">
            {borrowed.filter(b => b.status === 'borrowed' || b.status === 'pending_return').length}
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-white">Borrow History</h2>
          <p className="text-4xl font-bold text-primary mb-2">
            {borrowed.filter(b => b.status === 'returned').length}
          </p>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-white">Outstanding Fines</h2>
          <p className="text-3xl font-bold text-red-400 mb-2">₹{fines.totalFine || 0}</p>
          <button className="text-primary hover:text-blue-400 text-sm font-semibold transition-colors" disabled={fines.totalFine === 0}>
            {fines.totalFine > 0 ? 'Pay Fines \u2192' : 'No fines due'}
          </button>
        </AnimatedCard>

      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-secondary rounded-full"></span>
          Active Borrows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowed.filter(b => b.status === 'borrowed' || b.status === 'pending_return').map(borrow => (
             <AnimatedCard key={borrow._id} delay={0.1} className="bg-slate-800 p-5 rounded-xl border border-slate-700 group hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1 group-hover:text-secondary transition-colors">{borrow.bookId?.title || 'Unknown Book'}</h3>
                    <p className="text-sm text-slate-400">{borrow.bookId?.author}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${borrow.status === 'pending_return' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'}`}>
                    {borrow.status === 'pending_return' ? 'Pending' : 'Active'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Borrowed on:</span>
                    <span className="text-slate-300 font-medium">{new Date(borrow.borrowDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Return by:</span>
                    <span className={`font-bold ${new Date(borrow.dueDate) < new Date() ? 'text-red-400' : 'text-green-400'}`}>
                      {new Date(borrow.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                   <p className="text-sm font-bold text-red-400">
                     {borrow.fineAmount > 0 ? `Fine: ₹${borrow.fineAmount}` : 'No fine yet'}
                   </p>
                   <button 
                     onClick={() => handleReturn(borrow._id)}
                     disabled={borrow.status === 'pending_return'}
                     className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                       borrow.status === 'pending_return' 
                         ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                         : 'bg-secondary hover:bg-purple-600 text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/40'
                     }`}
                   >
                     {borrow.status === 'pending_return' ? 'Sent for Approval' : 'Return Now'}
                   </button>
                </div>
             </AnimatedCard>
          ))}
          {borrowed.filter(b => b.status === 'borrowed' || b.status === 'pending_return').length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-800/20 rounded-2xl border border-slate-700 border-dashed">
              <p className="text-slate-500">No active borrows found.</p>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          Borrowing History
        </h2>
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-700/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Returned On</th>
                  <th className="px-6 py-4 text-right">Fine Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {borrowed.filter(b => b.status === 'returned').map(record => (
                  <tr key={record._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{record.bookId?.title}</td>
                    <td className="px-6 py-4 text-slate-400">{record.bookId?.author}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(record.returnDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${record.fineAmount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {record.fineAmount > 0 ? `₹${record.fineAmount}` : 'None'}
                      </span>
                    </td>
                  </tr>
                ))}
                {borrowed.filter(b => b.status === 'returned').length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500 italic">Your history will appear here once you return your first book.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-slate-700 pt-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Recommended for You</h2>
          <button onClick={() => navigate('/books')} className="text-accent hover:underline font-medium flex items-center gap-1">
            Browse all <span className="text-lg">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableBooks.slice(0, 8).map((book, index) => (
            <FadeInSection key={book._id} delay={index * 0.05}>
              <AnimatedCard className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-accent transition-all duration-300 shadow-md flex flex-col h-full group">
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] bg-slate-700 text-secondary px-2 py-1 rounded-full font-bold uppercase tracking-widest group-hover:bg-secondary group-hover:text-white transition-colors">
                      {book.category?.name || 'Category'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{book.isbn}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-sm text-slate-400 mb-6">{book.author}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Availability</p>
                      <span className={`text-sm font-bold ${book.availableCopies > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {book.availableCopies} Copies
                      </span>
                    </div>
                    <button 
                      onClick={() => handleBorrow(book._id)}
                      disabled={book.availableCopies === 0}
                      className="text-sm font-bold text-white bg-primary hover:bg-blue-600 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none"
                    >
                      {book.availableCopies > 0 ? 'Borrow' : 'Waitlist'}
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </FadeInSection>
          ))}
          {availableBooks.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-800/10 rounded-2xl border border-slate-800 border-dashed">
              <p className="text-slate-500">Wait for new arrivals to enjoy reading!</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
