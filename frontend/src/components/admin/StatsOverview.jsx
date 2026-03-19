import AnimatedCard from '../animations/AnimatedCard';

const StatsOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatedCard delay={0.1} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-white">Total Students</h2>
        <p className="text-4xl font-bold text-accent mb-2">{stats.students}</p>
      </AnimatedCard>

      <AnimatedCard delay={0.2} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-white">Active Borrows</h2>
        <p className="text-4xl font-bold text-primary mb-2">{stats.borrows}</p>
      </AnimatedCard>

      <AnimatedCard delay={0.3} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-white">Overdue Books</h2>
        <p className="text-4xl font-bold text-red-500 mb-2">{stats.overdue}</p>
      </AnimatedCard>

      <AnimatedCard delay={0.4} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-white">Return Requests</h2>
        <p className="text-4xl font-bold text-yellow-500 mb-2">{stats.pendingReturns}</p>
      </AnimatedCard>
    </div>
  );
};

export default StatsOverview;
