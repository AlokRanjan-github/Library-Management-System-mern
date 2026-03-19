import FadeInSection from '../animations/FadeInSection';

const BorrowsTab = ({ borrows }) => {
  return (
    <FadeInSection>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Active Borrows & Fines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Book</th>
                <th className="p-4">Student</th>
                <th className="p-4">Borrow Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 rounded-tr-lg text-right">Fine Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {borrows.map(borrow => {
                const isOverdue = new Date(borrow.dueDate) < new Date();
                return (
                  <tr key={borrow._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-white font-medium">{borrow.bookId?.title || 'Unknown Book'}</td>
                    <td className="p-4 text-slate-300">{borrow.studentId?.name || 'Unknown Student'}</td>
                    <td className="p-4 text-slate-400 text-sm">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                    <td className={`p-4 text-sm font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                      {new Date(borrow.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded text-sm font-bold ${borrow.fineAmount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {borrow.fineAmount > 0 ? `₹${borrow.fineAmount}` : 'No Fine'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {borrows.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-slate-400">No active borrows found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FadeInSection>
  );
};

export default BorrowsTab;
