'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { userData } from '@/lib/data/userData';
import * as Icons from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function UserPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [spendingChartData, setSpendingChartData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [analyticsChartData, setAnalyticsChartData] = useState(null);
  const [billing, setBilling] = useState(null);
  const [settings, setSettings] = useState(null);
  
  const router = useRouter();
  const { branding, navigation } = userData;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/auth');
        return;
      }
      const data = await response.json();
      if (data.user.role === 'admin') {
        router.push('/admin');
        return;
      }
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        await Promise.all([
          fetchStats(),
          fetchSpendingChart()
        ]);
      } else if (activeTab === 'orders') {
        await fetchOrders();
      } else if (activeTab === 'analytics') {
        await fetchAnalyticsChart();
      } else if (activeTab === 'billing') {
        await fetchBilling();
      } else if (activeTab === 'settings') {
        await fetchSettings();
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const response = await fetch('/api/user/stats');
    const data = await response.json();
    if (data.success) {
      setStats(data.stats);
    }
  };

  const fetchSpendingChart = async () => {
    const response = await fetch('/api/user/spending-chart');
    const data = await response.json();
    if (data.success) {
      setSpendingChartData(data.data);
    }
  };

  const fetchOrders = async () => {
    const response = await fetch('/api/user/orders');
    const data = await response.json();
    if (data.success) {
      setOrders(data.orders);
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

  const fetchAnalyticsChart = async () => {
    const response = await fetch('/api/user/analytics-chart');
    const data = await response.json();
    if (data.success) {
      setAnalyticsChartData(data.data);
    }
  };

  const fetchBilling = async () => {
    const response = await fetch('/api/user/billing');
    const data = await response.json();
    if (data.success) {
      setBilling(data.billing);
    }
  };

  const fetchSettings = async () => {
    const response = await fetch('/api/user/settings');
    const data = await response.json();
    if (data.success) {
      setSettings(data.settings);
    }
  };

  const handleSettingsUpdate = async (updatedSettings) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Settings update error:', error);
    }
  };

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName.split('-').map((w, i) => 
      i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
    ).join('').replace(/^./, str => str.toUpperCase())];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const getStatusColor = (color) => {
    const colors = {
      green: 'bg-emerald-100 text-emerald-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-amber-100 text-amber-800',
      red: 'bg-rose-100 text-rose-800',
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      cancelled: 'bg-rose-100 text-rose-800'
    };
    return colors[color] || 'bg-slate-100 text-slate-800';
  };

  const renderDashboard = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName || 'User'}!
        </h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = Icons[stat.icon.split('-').map((w, i) => 
            i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
          ).join('').replace(/^./, str => str.toUpperCase())];
          
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {Icon && <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' :
                  stat.changeType === 'negative' ? 'text-rose-600 bg-rose-50' :
                  'text-slate-600 bg-slate-50'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Spending Trend</h3>
        <div className="h-80">
          {spendingChartData ? (
            <Line
              data={spendingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (value) => '$' + value }
                  }
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
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                <td className="px-6 py-4 text-slate-900 font-semibold">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.statusColor)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Usage Analytics</h3>
        <div className="h-80">
          {analyticsChartData ? (
            <Bar
              data={analyticsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Current Plan</h3>
        {billing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-lg font-semibold text-gray-900">{billing.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold capitalize">{billing.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Billing Cycle</p>
                <p className="text-lg font-semibold capitalize">{billing.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-gray-900">${billing.amount}/mo</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Current Period</p>
              <p className="text-sm text-gray-900">
                {new Date(billing.currentPeriodStart).toLocaleDateString()} - {new Date(billing.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading billing information...</p>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
        {settings ? (
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications?.email}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="rounded text-indigo-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Order Updates</span>
              <input
                type="checkbox"
                checked={settings.notifications?.orderUpdates}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    notifications: { ...settings.notifications, orderUpdates: e.target.checked }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="rounded text-indigo-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Newsletter</span>
              <input
                type="checkbox"
                checked={settings.notifications?.newsletter}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    notifications: { ...settings.notifications, newsletter: e.target.checked }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="rounded text-indigo-600"
              />
            </label>
          </div>
        ) : (
          <p className="text-gray-500">Loading settings...</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
        {settings && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Profile Visibility</label>
              <select
                value={settings.privacy?.profileVisibility}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    privacy: { ...settings.privacy, profileVisibility: e.target.value }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Show Email</span>
              <input
                type="checkbox"
                checked={settings.privacy?.showEmail}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    privacy: { ...settings.privacy, showEmail: e.target.checked }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="rounded text-indigo-600"
              />
            </label>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
        {settings && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Language</label>
              <select
                value={settings.preferences?.language || 'en'}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    preferences: { ...settings.preferences, language: e.target.value }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.preferences?.timezone || 'UTC'}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    preferences: { ...settings.preferences, timezone: e.target.value }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Currency</label>
              <select
                value={settings.preferences?.currency || 'USD'}
                onChange={(e) => {
                  const updated = {
                    ...settings,
                    preferences: { ...settings.preferences, currency: e.target.value }
                  };
                  setSettings(updated);
                  handleSettingsUpdate(updated);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
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
    <div className="min-h-screen bg-slate-50 overflow-y-scroll">
      <Toaster position="top-right" />
      
      {/* Glassmorphic Loading Overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-700 font-medium">Logging out...</p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo & Branding */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                {renderIcon(branding.logo)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{branding.name}</h1>
                <p className="text-xs text-blue-100">{branding.subtitle}</p>
              </div>
            </div>

            {/* Right side - User Info & Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Icons.Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-blue-600"></span>
              </button>

              {/* User Profile */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.fullName}</p>
                  <p className="text-xs text-blue-100 capitalize">{user.plan}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
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

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? 'border-blue-600 text-blue-600'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-180px)]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </main>
    </div>
  );
}
