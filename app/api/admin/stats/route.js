import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import Analytics from '@/lib/models/Analytics';

async function handler(request) {
  try {
    await dbConnect();

    // Get total users count
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Calculate user growth
    const userGrowth = lastMonthUsers > 0 ? ((lastMonthUsers / totalUsers) * 100).toFixed(1) : 0;

    // Get total revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Get last month revenue
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          status: 'Completed',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenueLastMonth = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = totalRevenue > 0 ? ((revenueLastMonth / totalRevenue) * 100).toFixed(1) : 0;

    // Get total orders
    const totalOrders = await Order.countDocuments();
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const ordersGrowth = totalOrders > 0 ? ((lastMonthOrders / totalOrders) * 100).toFixed(1) : 0;

    // Get monthly growth (simplified calculation)
    const monthlyGrowth = ((parseFloat(userGrowth) + parseFloat(revenueGrowth)) / 2).toFixed(1);

    const stats = [
      {
        id: 'total-users',
        title: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: `+${userGrowth}%`,
        changeType: 'positive',
        icon: 'users',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
      },
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: `+${revenueGrowth}%`,
        changeType: 'positive',
        icon: 'dollar-sign',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        id: 'total-orders',
        title: 'Total Orders',
        value: totalOrders.toLocaleString(),
        change: `+${ordersGrowth}%`,
        changeType: 'positive',
        icon: 'shopping-bag',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        id: 'monthly-growth',
        title: 'Monthly Growth',
        value: `${monthlyGrowth}%`,
        change: `+${(monthlyGrowth * 0.3).toFixed(1)}%`,
        changeType: 'positive',
        icon: 'trending-up',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600'
      }
    ];

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireRole('admin')(handler);
