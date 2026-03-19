import FadeInSection from '../animations/FadeInSection';
import AnimatedCard from '../animations/AnimatedCard';

const StudentsTab = ({
  students,
  showStudentForm,
  setShowStudentForm,
  studentFormData,
  setStudentFormData,
  handleStudentSubmit,
  openEditStudentForm,
  handleDeleteStudent
}) => {
  return (
    <FadeInSection>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Students</h2>

        {showStudentForm && (
          <AnimatedCard delay={0} className="bg-slate-700 p-6 rounded-lg mb-8 border border-slate-600">
            <h3 className="text-lg font-bold mb-4">Edit Student Profile</h3>
            <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Full Name" required value={studentFormData.name} onChange={e => setStudentFormData({ ...studentFormData, name: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <input type="email" placeholder="Email Address" required value={studentFormData.email} onChange={e => setStudentFormData({ ...studentFormData, email: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <input type="text" placeholder="Course" required value={studentFormData.course} onChange={e => setStudentFormData({ ...studentFormData, course: e.target.value })} className="px-3 py-2 bg-slate-800 rounded border border-slate-600 focus:border-accent text-white" />
              <div className="md:col-span-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowStudentForm(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md transition-colors text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-secondary hover:bg-purple-600 text-white font-semibold rounded-md transition-colors text-sm">Save Changes</button>
              </div>
            </form>
          </AnimatedCard>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course</th>
                <th className="p-4">Joined</th>
                <th className="p-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {students.map(student => (
                <tr key={student._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-white font-medium">{student.name}</td>
                  <td className="p-4 text-slate-300">{student.email}</td>
                  <td className="p-4 text-slate-400">{student.course || 'N/A'}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditStudentForm(student)} className="text-secondary hover:text-purple-400 mr-4 text-sm font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDeleteStudent(student._id)} className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-slate-400">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </FadeInSection>
  );
};

export default StudentsTab;
