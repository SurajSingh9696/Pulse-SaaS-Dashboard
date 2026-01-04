import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;

    // Get spending data for the last 12 months
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const spendingData = await Order.aggregate([
      {
        $match: {
          userId: userId,
          status: 'Completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Create array for last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = Array(12).fill(0);
    const labels = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(months[date.getMonth()]);
    }

    // Map spending data to months
    spendingData.forEach(item => {
      const monthIndex = item._id.month - 1;
      const year = item._id.year;
      const currentYear = now.getFullYear();
      const monthsAgo = (currentYear - year) * 12 + (now.getMonth() - monthIndex);
      
      if (monthsAgo >= 0 && monthsAgo < 12) {
        data[11 - monthsAgo] = item.total;
      }
    });

    const chartData = {
      labels,
      datasets: [{
        label: 'Monthly Spending',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    return NextResponse.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('User spending chart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
