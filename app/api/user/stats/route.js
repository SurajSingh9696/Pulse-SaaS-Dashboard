import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;

    // Get user's orders
    const totalOrders = await Order.countDocuments({ userId });
    
    const completedOrders = await Order.countDocuments({
      userId,
      status: 'Completed'
    });

    // Get total amount spent
    const amountAgg = await Order.aggregate([
      { $match: { userId: userId, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpent = amountAgg[0]?.total || 0;

    // Get this month's orders
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth }
    });

    // Calculate growth percentages
    const lastMonth = new Date(startOfMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthOrders = await Order.countDocuments({
      userId,
      createdAt: {
        $gte: lastMonth,
        $lt: startOfMonth
      }
    });

    const orderGrowth = lastMonthOrders > 0 
      ? Math.round(((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : (monthlyOrders > 0 ? 100 : 0);

    // Get last month's spending for growth calculation
    const lastMonthSpending = await Order.aggregate([
      {
        $match: {
          userId: userId,
          status: 'Completed',
          createdAt: {
            $gte: lastMonth,
            $lt: startOfMonth
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const lastMonthSpent = lastMonthSpending[0]?.total || 0;

    const thisMonthSpending = await Order.aggregate([
      {
        $match: {
          userId: userId,
          status: 'Completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const thisMonthSpent = thisMonthSpending[0]?.total || 0;

    const spendingGrowth = lastMonthSpent > 0 
      ? Math.round(((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100)
      : (thisMonthSpent > 0 ? 100 : 0);

    const stats = [
      {
        id: 'total-orders',
        title: 'Total Orders',
        value: totalOrders.toString(),
        change: `+${orderGrowth}%`,
        changeType: orderGrowth >= 0 ? 'positive' : 'negative',
        icon: 'shopping-bag',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        id: 'amount-spent',
        title: 'Amount Spent',
        value: `$${totalSpent.toLocaleString()}`,
        change: `${spendingGrowth >= 0 ? '+' : ''}${spendingGrowth}%`,
        changeType: spendingGrowth >= 0 ? 'positive' : 'negative',
        icon: 'dollar-sign',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        id: 'monthly-orders',
        title: 'Orders This Month',
        value: monthlyOrders.toString(),
        change: 'This Month',
        changeType: 'neutral',
        icon: 'calendar',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    ];

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
