import React, { useEffect, useState } from 'react';
import {
  FaBox,
  FaTags,
  FaClipboardList,
  FaWarehouse,
  FaBoxes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartLine,
  FaRobot
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import DashboardChart from './DashboardChart';
import AIChatPanel from './AIChatPanel';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [counts, setCounts] = useState({
    orders: 0,
    acceptedOrders: 0,
    rejectedOrders: 0,
    pendingOrders: 0,
    categories: 0,
    subcategories: 0,
    products: 0,
    warehouses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [trendData, setTrendData] = useState(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [countsResponse, trendsResponse] = await Promise.all([
        Axios(SummaryApi.AdminDashboardCounts),
        Axios(SummaryApi.AdminTrendsData)
      ]);

      const { success: countsSuccess, data: countsData } = countsResponse.data;
      const { success: trendsSuccess, data: trendsData } = trendsResponse.data;

      if (countsSuccess) {
        setCounts(countsData);
      }
      if (trendsSuccess) {
        setTrendData(trendsData);
      }
    } catch (err) {
      AxiosTostError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: 'Total Orders',
      icon: <FaClipboardList className="text-blue-400 text-2xl sm:text-3xl" />,
      value: counts.orders,
      trend: trendData?.orderTrend,
      bg: 'bg-gradient-to-br from-blue-900 to-blue-700'
    },
    {
      label: 'Accepted Orders',
      icon: <FaCheckCircle className="text-emerald-400 text-2xl sm:text-3xl" />,
      value: counts.acceptedOrders,
      trend: trendData?.acceptedTrend,
      bg: 'bg-gradient-to-br from-emerald-900 to-emerald-700'
    },
    {
      label: 'Rejected Orders',
      icon: <FaTimesCircle className="text-rose-400 text-2xl sm:text-3xl" />,
      value: counts.rejectedOrders,
      trend: trendData?.rejectedTrend,
      bg: 'bg-gradient-to-br from-rose-900 to-rose-700'
    },
    {
      label: 'Pending Orders',
      icon: <FaClock className="text-amber-400 text-2xl sm:text-3xl" />,
      value: counts.pendingOrders,
      trend: trendData?.pendingTrend,
      bg: 'bg-gradient-to-br from-amber-900 to-amber-700'
    },
    {
      label: 'Categories',
      icon: <FaTags className="text-indigo-400 text-2xl sm:text-3xl" />,
      value: counts.categories,
      trend: trendData?.categoryTrend,
      bg: 'bg-gradient-to-br from-indigo-900 to-indigo-700'
    },
    {
      label: 'Subcategories',
      icon: <FaBoxes className="text-orange-400 text-2xl sm:text-3xl" />,
      value: counts.subcategories,
      trend: trendData?.subcategoryTrend,
      bg: 'bg-gradient-to-br from-orange-900 to-orange-700'
    },
    {
      label: 'Products',
      icon: <FaBox className="text-purple-400 text-2xl sm:text-3xl" />,
      value: counts.products,
      trend: trendData?.productTrend,
      bg: 'bg-gradient-to-br from-purple-900 to-purple-700'
    },
    {
      label: 'Warehouses',
      icon: <FaWarehouse className="text-teal-400 text-2xl sm:text-3xl" />,
      value: counts.warehouses,
      trend: trendData?.warehouseTrend,
      bg: 'bg-gradient-to-br from-teal-900 to-teal-700'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="p-4 sm:p-6 min-h-[88vh] bg-gray-50 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
             Dashboard
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">Real-time analytics and insights</p>
        </div>
        <button 
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300"
        >
          <FaRobot className="text-lg sm:text-xl" />
          <span>AI Assistant</span>
        </button>
      </div>

      {showAIPanel && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <AIChatPanel onClose={() => setShowAIPanel(false)} />
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      > 
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={`${card.bg} rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
          >
            <div className="absolute top-2 right-2 p-2 opacity-20">
              {card.icon}
            </div>
            <div className="relative z-10">
              <p className="text-gray-300 text-xs sm:text-sm font-medium">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-bold my-1 sm:my-2">
                {loading ? (
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  card.value
                )}
              </p>
              {card.trend !== undefined && (
                <div className="flex items-center text-xs mt-1 sm:mt-2">
                  <FaChartLine className={`mr-1 ${card.trend > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={card.trend > 0 ? 'text-green-400' : 'text-red-400'}>
                    {card.trend > 0 ? '+' : ''}{card.trend}% this month
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start pb-3 sm:pb-4 border-b border-gray-700 last:border-0">
                <div className="bg-indigo-500 p-2 rounded-lg mr-3">
                  <FaBox className="text-white text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">New product added</p>
                  <p className="text-gray-400 text-xs sm:text-sm">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link to="/admin/upload-product" className="bg-indigo-600 hover:bg-indigo-700 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-center">
              <FaBox className="text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Add Product</span>
            </Link>
            <Link to="/admin/create-pickup" className="bg-emerald-600 hover:bg-emerald-700 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-center">
              <FaWarehouse className="text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Manage Warehouse</span>
            </Link>
            <Link to="/admin/category" className="bg-purple-600 hover:bg-purple-700 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-center">
              <FaTags className="text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Categories</span>
            </Link>
            <Link to="/admin/orders" className="bg-amber-600 hover:bg-amber-700 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-center">
              <FaClipboardList className="text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Manage Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
