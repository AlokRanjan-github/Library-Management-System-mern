import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/animations/PageTransition';
import { adminService, authService, bookService } from '../services/api';

// Modular Components
import StatsOverview from '../components/admin/StatsOverview';
import BooksTab from '../components/admin/BooksTab';
import StudentsTab from '../components/admin/StudentsTab';
import BorrowsTab from '../components/admin/BorrowsTab';
import ReturnsTab from '../components/admin/ReturnsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    borrows: 0,
    overdue: 0,
    pendingReturns: 0
  });

  // Data States
  const [students, setStudents] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);

  // Student Form State
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({
    name: '', email: '', course: ''
  });

  // Book Form State
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookFormData, setBookFormData] = useState({
    title: '', author: '', isbn: '', totalCopies: 1, category: ''
  });

  const [showCategoryList, setShowCategoryList] = useState(false);
  const categoryRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Close category dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const results = await Promise.allSettled([
        adminService.getAllStudents(),
        adminService.getAllBorrowedBooks(),
        adminService.getOverdueBooks(),
        bookService.getBooks(),
        adminService.getAllCategories(),
        adminService.getPendingReturns()
      ]);

      const [
        studentsRes, 
        borrowsRes, 
        overdueRes, 
        booksRes, 
        categoriesRes, 
        pendingReturnsRes
      ] = results;

      if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value);
      if (borrowsRes.status === 'fulfilled') setBorrows(borrowsRes.value);
      if (booksRes.status === 'fulfilled') {
        const bResult = booksRes.value;
        setBooks(bResult.books || bResult);
      }
      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value);
      if (pendingReturnsRes.status === 'fulfilled') setPendingReturns(pendingReturnsRes.value);

      setStats({
        students: studentsRes.status === 'fulfilled' ? studentsRes.value.length : 0,
        borrows: borrowsRes.status === 'fulfilled' ? borrowsRes.value.length : 0,
        overdue: overdueRes.status === 'fulfilled' ? overdueRes.value.length : 0,
        pendingReturns: pendingReturnsRes.status === 'fulfilled' ? pendingReturnsRes.value.length : 0
      });

      // Handle any specific 401/403 errors in any of the promises
      const authError = results.find(r => r.status === 'rejected' && (r.reason?.response?.status === 401 || r.reason?.response?.status === 403));
      if (authError) {
        navigate('/login');
        return;
      }

    } catch (err) {
      setError('An unexpected error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await adminService.deleteBook(id);
        fetchAdminData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await adminService.updateBook(editingBook._id, bookFormData);
        toast.success('Book updated successfully');
      } else {
        await adminService.createBook(bookFormData);
        toast.success('Book added successfully');
      }
      setShowBookForm(false);
      setEditingBook(null);
      setBookFormData({ title: '', author: '', isbn: '', totalCopies: 1, category: '' });
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    }
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setBookFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      totalCopies: book.totalCopies,
      category: book.category?.name || book.category || ''
    });
    setShowBookForm(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('WARNING: Deleting a student will also wipe their borrow history. Are you sure?')) {
      try {
        await adminService.deleteStudent(id);
        toast.success('Student deleted successfully');
        fetchAdminData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await adminService.updateStudent(editingStudent._id, studentFormData);
        toast.success('Student profile updated successfully');
      }
      setShowStudentForm(false);
      setEditingStudent(null);
      setStudentFormData({ name: '', email: '', course: '' });
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleApproveReturn = async (id) => {
    if (window.confirm('Confirm that this book has been physically returned?')) {
      try {
        await adminService.approveReturn(id);
        toast.success('Return approved! Inventory updated.');
        fetchAdminData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to approve return');
      }
    }
  };

  const openEditStudentForm = (student) => {
    setEditingStudent(student);
    setStudentFormData({
      name: student.name,
      email: student.email,
      course: student.course || ''
    });
    setShowStudentForm(true);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-dark text-white p-8">Loading Admin Portal...</div>;
  if (error) return <div className="min-h-screen bg-dark text-red-500 p-8">{error}</div>;

  return (
    <PageTransition className="bg-dark p-8 md:p-12 text-light min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-700 pb-6">
        <h1 className="text-3xl font-bold text-secondary">Admin Portal</h1>
        <div className="flex gap-2">
          {['overview', 'books', 'students', 'borrows', 'returns'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-semibold capitalize ${activeTab === tab ? 'bg-secondary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
            >
              {tab === 'returns' ? 'Requests' : tab}
            </button>
          ))}
          <button onClick={handleLogout} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border-l border-slate-600 rounded-r-md transition-colors text-white text-sm font-semibold ml-2">
            Logout
          </button>
        </div>
      </div>

      {activeTab === 'overview' && <StatsOverview stats={stats} />}

      {activeTab === 'books' && (
        <BooksTab 
          books={books}
          categories={categories}
          showBookForm={showBookForm}
          setShowBookForm={setShowBookForm}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          bookFormData={bookFormData}
          setBookFormData={setBookFormData}
          showCategoryList={showCategoryList}
          setShowCategoryList={setShowCategoryList}
          categoryRef={categoryRef}
          handleBookSubmit={handleBookSubmit}
          handleDeleteBook={handleDeleteBook}
          openEditForm={openEditForm}
        />
      )}

      {activeTab === 'students' && (
        <StudentsTab 
          students={students}
          showStudentForm={showStudentForm}
          setShowStudentForm={setShowStudentForm}
          studentFormData={studentFormData}
          setStudentFormData={setStudentFormData}
          handleStudentSubmit={handleStudentSubmit}
          openEditStudentForm={openEditStudentForm}
          handleDeleteStudent={handleDeleteStudent}
        />
      )}

      {activeTab === 'borrows' && <BorrowsTab borrows={borrows} />}

      {activeTab === 'returns' && (
        <ReturnsTab 
          pendingReturns={pendingReturns}
          handleApproveReturn={handleApproveReturn}
        />
      )}
    </PageTransition>
  );
};

export default AdminDashboard;
