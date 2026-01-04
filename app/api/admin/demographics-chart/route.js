import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

async function handler(request) {
  try {
    await dbConnect();

    // Get user demographics by plan
    const demographics = await User.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    
    // Create data structure for chart
    const planOrder = ['Enterprise', 'Pro Plan', 'Free Tier'];
    const colors = ['#6366f1', '#60a5fa', '#cbd5e1'];
    
    const data = planOrder.map(plan => {
      const planData = demographics.find(d => d._id === plan);
      return planData ? planData.count : 0;
    });

    const chartData = {
      labels: planOrder,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    };

    const legend = planOrder.map((plan, index) => {
      const count = data[index];
      const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
      
      return {
        label: plan,
        percentage: `${percentage}%`,
        color: `bg-${['indigo', 'blue', 'slate'][index]}-500`
      };
    });

    return NextResponse.json({
      success: true,
      data: chartData,
      legend
    });
  } catch (error) {
    console.error('Admin demographics chart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireRole('admin')(handler);
