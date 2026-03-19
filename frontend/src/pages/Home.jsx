import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import PageTransition from '../components/animations/PageTransition';
import { FaBook, FaUsersCog, FaTags, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { publicService } from '../services/api';

const featureList = [
  {
    icon: <FaBook className="w-8 h-8 text-primary" />,
    title: 'Book Borrowing System',
    description: 'Seamlessly search, browse, and borrow books from a vast catalog directly from your student dashboard.'
  },
  {
    icon: <FaUsersCog className="w-8 h-8 text-red-500" />,
    title: 'Admin Management',
    description: 'Powerful admin panel to oversee all student accounts, library inventory, and returning schedules.'
  },
  {
    icon: <FaTags className="w-8 h-8 text-accent" />,
    title: 'Category Based Books',
    description: 'Smart categorization makes it extremely easy to filter out genres and locate exactly what you are trying to study.'
  },
  {
    icon: <FaShieldAlt className="w-8 h-8 text-green-500" />,
    title: 'Secure Authentication',
    description: 'Enterprise-grade JWT role-based security ensures your personal data and library transaction history is safe.'
  },
  {
    icon: <FaChartLine className="w-8 h-8 text-purple-500" />,
    title: 'Automated Fines',
    description: 'Real-time fine calculation in INR automatically adjusts your account balance if books become overdue.'
  },
  {
    icon: <FaChartLine className="w-8 h-8 text-blue-400" />,
    title: 'Dynamic Reporting',
    description: 'Students and admins get deep insights into reading habits, library usage, and resource distribution.'
  }
];

const Home = () => {
  const [stats, setStats] = useState([
    { label: 'Total Books', value: '0+' },
    { label: 'Total Categories', value: '0' },
    { label: 'Active Students', value: '0+' },
    { label: 'Borrowed Books', value: '0' }
  ]);
  const [latestBooks, setLatestBooks] = useState([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await publicService.getLibraryStats();
        if (data.stats) setStats(data.stats);
        if (data.latestBooks) setLatestBooks(data.latestBooks);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <PageTransition className="bg-[#030712] text-slate-200">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Spline Container */}
        <div className="absolute inset-0 z-0">
          {!isMobile ? (
            <Spline
              scene="https://prod.spline.design/871WiwurlAM-Whpb/scene.splinecode"
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full bg-no-repeat bg-center"
              style={{ 
                backgroundImage: `url('/hero-mobile.png')`,
                backgroundSize: '150%'
              }}
            />
          )}
          {/* subtle mask to ensure text readability without hiding the 3D scene */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-3 gap-12 items-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left lg:col-span-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm pointer-events-auto cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              V3.0 Smart System
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none text-white pointer-events-none select-none">
              SMART <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                LIBRARY
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300/80 mb-10 max-w-lg leading-relaxed font-light pointer-events-none select-none">
              Elevate your academic workflow with a seamlessly automated library ecosystem. Built for the modern university.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/books"
                className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-lg hover:shadow-white/20 pointer-events-auto"
              >
                Browse Books
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold hover:bg-white/10 transition-all pointer-events-auto"
              >
                Register Now
              </Link>
            </div>

            <div className="mt-16 flex gap-8 border-t border-white/5 pt-10 h-20 pointer-events-none">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white leading-none">{stat.value || 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Center Space for Spline Interaction */}
          <div className="lg:col-span-1 hidden lg:block" />

          {/* Right Side - Live Data Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4 pointer-events-none"
          >
            {latestBooks.length > 0 && (
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group pointer-events-none">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">New Arrival</span>
                 <span className="text-[10px] text-slate-500">Just added</span>
               </div>
               <h4 className="text-white font-bold mb-1 truncate">{latestBooks[0].title}</h4>
               <p className="text-xs text-slate-400 mb-4">{latestBooks[0].category?.name || 'Academic'} Section</p>
               <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                 <div className="bg-blue-500 w-full h-full animate-[shimmer_2s_infinite]" />
               </div>
             </div>
            )}

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all pointer-events-none">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Library Pulse</span>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-purple-500 animate-pulse" />
                  <div className="w-1 h-3 bg-purple-500 animate-pulse delay-75" />
                  <div className="w-1 h-3 bg-purple-500 animate-pulse delay-150" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-black text-white">{stats[2]?.value || '0+'}</div>
                <div className="text-[10px] text-slate-500 leading-tight uppercase font-bold">Students <br /> Registered</div>
              </div>
            </div>

            <Link to="/books" className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group pointer-events-auto">
              Access Full Catalog <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features - Modern Grid */}
      <section className="py-32 relative z-10 bg-[#030712]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Library Ecosystem</h2>
            <p className="text-slate-400 text-lg">Our automated platform integrates cutting-edge architecture to simplify management for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 backdrop-blur-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400/80 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
