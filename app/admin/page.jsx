'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import * as Icons from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const branding = {
  name: 'Pulse',
  subtitle: 'Admin Panel',
  logo: 'activity'
};

const navigation = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'orders', label: 'Orders', icon: 'shopping-cart' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [admin, setAdmin] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [demographicsChartData, setDemographicsChartData] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [loadingMoreOrders, setLoadingMoreOrders] = useState(false);
  const [systemSettings, setSystemSettings] = useState(null);
  const [banningUser, setBanningUser] = useState(null);
  const [banUserEmail, setBanUserEmail] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (admin) {
      fetchData(activeTab);
    }
  }, [activeTab, admin]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth');
        return;
      }
      const data = await res.json();
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/user');
        return;
      }
      setAdmin(data.user);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth');
    }
  };

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'overview':
          await Promise.all([fetchStats(), fetchRevenueChart(), fetchDemographicsChart()]);
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'orders':
          await fetchOrders();
          break;
        case 'settings':
          await fetchSettings();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const fetchRevenueChart = async () => {
    try {
      const res = await fetch('/api/admin/revenue-chart');
      if (!res.ok) throw new Error('Failed to fetch revenue chart');
      const response = await res.json();
      setRevenueChartData(response.data);
    } catch (error) {
      console.error('Error fetching revenue chart:', error);
      toast.error('Failed to load revenue chart');
    }
  };

  const fetchDemographicsChart = async () => {
    try {
      const res = await fetch('/api/admin/demographics-chart');
      if (!res.ok) throw new Error('Failed to fetch demographics chart');
      const response = await res.json();
      setDemographicsChartData(response.data);
    } catch (error) {
      console.error('Error fetching demographics chart:', error);
      toast.error('Failed to load demographics chart');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchOrders = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMoreOrders(true);
      }
      const res = await fetch(`/api/admin/orders?page=${page}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      
      if (append) {
        setOrders(prev => [...prev, ...data.orders]);
      } else {
        setOrders(data.orders);
      }
      
      setHasMoreOrders(data.pagination.page < data.pagination.pages);
      setOrdersPage(page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      if (append) {
        setLoadingMoreOrders(false);
      }
    }
  };

  const handleLoadMoreOrders = () => {
    if (!loadingMoreOrders && hasMoreOrders) {
      fetchOrders(ordersPage + 1, true);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSystemSettings(data.systemSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSettingsUpdate = async (updatedSettings) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('System settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Settings update error:', error);
    }
  };

  const handleBanUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to ban ${userName}? This will permanently delete the user and all their data.`)) {
      return;
    }

    setBanningUser(userId);
    try {
      const response = await fetch(`/api/admin/ban-user?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User banned successfully');
        // Refresh users list
        await fetchUsers();
      } else {
        toast.error(data.message || 'Failed to ban user');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Ban user error:', error);
    } finally {
      setBanningUser(null);
    }
  };

  const handleBanUserByEmail = async () => {
    if (!banUserEmail || !banUserEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(banUserEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!confirm(`Are you sure you want to ban user with email "${banUserEmail}"?\n\nThis action will:\n• Permanently delete the user account\n• Remove all associated data (orders, analytics, billing, settings)\n• This action cannot be undone\n\nClick OK to confirm or Cancel to abort.`)) {
      return;
    }

    setBanningUser('email');
    try {
      const response = await fetch(`/api/admin/ban-user?email=${encodeURIComponent(banUserEmail)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User banned and all data deleted successfully');
        setBanUserEmail('');
        // Refresh users list if on users tab
        if (activeTab === 'users') {
          await fetchUsers();
        }
      } else {
        toast.error(data.message || 'Failed to ban user');
      }
    } catch (error) {
      toast.error('An error occurred while banning user');
      console.error('Ban user error:', error);
    } finally {
      setBanningUser(null);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      setTimeout(() => {
        router.push('/auth');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      setLoggingOut(false);
    }
  };

  const renderIcon = (iconName) => {
    const name = iconName.split('-').map((w, i) => 
      i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
    ).join('').replace(/^./, str => str.toUpperCase());
    const Icon = Icons[name];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      cancelled: 'bg-rose-100 text-rose-800',
      processing: 'bg-blue-100 text-blue-800',
      active: 'bg-emerald-100 text-emerald-800',
      inactive: 'bg-slate-100 text-slate-600',
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h3>
        {systemSettings ? (
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">Maintenance Mode</span>
                <p className="text-xs text-gray-600 mt-1">Enable to prevent users from accessing the platform</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.maintenanceMode}
                onChange={(e) => {
                  const updated = {
                    ...systemSettings,
                    maintenanceMode: e.target.checked
                  };
                  setSystemSettings(updated);
                  handleSettingsUpdate({ systemSettings: updated });
                }}
                className="rounded text-indigo-600 h-5 w-5"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">Pause Registration</span>
                <p className="text-xs text-gray-600 mt-1">Temporarily disable new user signups</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.registrationPaused}
                onChange={(e) => {
                  const updated = {
                    ...systemSettings,
                    registrationPaused: e.target.checked
                  };
                  setSystemSettings(updated);
                  handleSettingsUpdate({ systemSettings: updated });
                }}
                className="rounded text-indigo-600 h-5 w-5"
              />
            </label>
          </div>
        ) : (
          <p className="text-gray-500">Loading system settings...</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ban User by Email</h3>
        <p className="text-sm text-gray-600 mb-6">Permanently delete a user and all their associated data by entering their email address.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Email Address</label>
            <input
              type="email"
              value={banUserEmail}
              onChange={(e) => setBanUserEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={banningUser === 'email'}
            />
          </div>
          <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
            <Icons.AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Warning: This action cannot be undone</p>
              <p>Banning a user will permanently delete:</p>
              <ul className="list-disc ml-4 mt-1 space-y-0.5">
                <li>User account</li>
                <li>All orders</li>
                <li>Analytics data</li>
                <li>Billing information</li>
                <li>Settings and preferences</li>
              </ul>
            </div>
          </div>
          <button
            onClick={handleBanUserByEmail}
            disabled={banningUser === 'email' || !banUserEmail.trim()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {banningUser === 'email' ? (
              <>
                <Icons.Loader2 className="w-5 h-5 animate-spin" />
                <span>Banning User...</span>
              </>
            ) : (
              <>
                <Icons.UserX className="w-5 h-5" />
                <span>Ban User & Delete All Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {renderIcon(stat.icon)}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' :
                  stat.changeType === 'negative' ? 'text-rose-600 bg-rose-50' :
                  'text-slate-600 bg-slate-50'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Overview</h3>
          <div className="h-80">
            {revenueChartData ? (
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { borderDash: [2, 4] }
                    },
                    x: { grid: { display: false } }
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chart...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">User Demographics</h3>
          <div className="h-64 flex items-center justify-center">
            {demographicsChartData ? (
              <Doughnut
                data={demographicsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                  cutout: '70%'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chart...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{user.fullName}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600 capitalize">{user.plan}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleBanUser(user._id, user.fullName)}
                      disabled={banningUser === user._id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      {banningUser === user._id ? (
                        <>
                          <Icons.Loader2 className="w-3 h-3 animate-spin" />
                          <span>Banning...</span>
                        </>
                      ) : (
                        <>
                          <Icons.UserX className="w-3 h-3" />
                          <span>Ban User</span>
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{order.orderId}</td>
                <td className="px-6 py-4 text-slate-600">{order.userId?.fullName || 'Unknown'}</td>
                <td className="px-6 py-4 text-slate-900 font-semibold">${order.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMoreOrders && (
        <div className="p-6 border-t border-slate-200 flex justify-center">
          <button
            onClick={handleLoadMoreOrders}
            disabled={loadingMoreOrders}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loadingMoreOrders ? (
              <>
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Icons.ChevronDown className="w-4 h-4" />
                <span>Load More Orders</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {/* Glassmorphic Loading Overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-700 font-medium">Logging out...</p>
            </div>
          </div>
        </div>
      )}
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo & Branding */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                {renderIcon(branding.logo)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{branding.name}</h1>
                <p className="text-xs text-indigo-100">{branding.subtitle}</p>
              </div>
            </div>

            {/* Right side - User Info & Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Icons.Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-indigo-600"></span>
              </button>

              {/* User Profile */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{admin.fullName}</p>
                  <p className="text-xs text-indigo-100 capitalize">{admin.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20">
                  {admin.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Icons.LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {renderIcon(item.icon)}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icons.Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </main>
    </div>
  );
}
