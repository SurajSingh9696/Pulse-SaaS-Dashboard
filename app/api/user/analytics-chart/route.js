import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Analytics from '@/lib/models/Analytics';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;
    
    // Get usage analytics for last 4 weeks
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const weeklyUsage = await Analytics.aggregate([
      {
        $match: {
          userId: userId,
          type: 'usage',
          date: { $gte: fourWeeksAgo }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$date' }
          },
          total: { $sum: '$value' }
        }
      },
      { $sort: { '_id.week': 1 } },
      { $limit: 4 }
    ]);

    // Format data for chart
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const data = Array(4).fill(0);

    weeklyUsage.forEach((item, index) => {
      if (index < 4) {
        data[index] = item.total;
      }
    });

    const chartData = {
      labels,
      datasets: [{
        label: 'Usage Hours',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    };

    return NextResponse.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Analytics chart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
