import FadeInSection from '../animations/FadeInSection';

const ReturnsTab = ({ pendingReturns, handleApproveReturn }) => {
  return (
    <FadeInSection>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Pending Return Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Book Title</th>
                <th className="p-4">Student</th>
                <th className="p-4">Request Date</th>
                <th className="p-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {pendingReturns.map(req => (
                <tr key={req._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-white font-medium">{req.bookId?.title}</td>
                  <td className="p-4 text-slate-300">
                    <div>{req.studentId?.name}</div>
                    <div className="text-xs text-slate-500">{req.studentId?.email}</div>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(req.returnDate).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleApproveReturn(req._id)} 
                      className="px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded text-sm font-bold transition-all"
                    >
                      Approve Return
                    </button>
                  </td>
                </tr>
              ))}
              {pendingReturns.length === 0 && (
                <tr><td colSpan="4" className="p-4 text-center text-slate-400">No pending return requests.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FadeInSection>
  );
};

export default ReturnsTab;
