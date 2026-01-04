import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ userId });

    // Format orders for display
    const formattedOrders = orders.map(order => ({
      id: order.orderId,
      date: order.createdAt.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      amount: `$${order.amount.toFixed(2)}`,
      status: order.status,
      statusColor: order.status === 'Completed' ? 'green' : 
                   order.status === 'Processing' ? 'blue' : 
                   order.status === 'Pending' ? 'yellow' : 'red'
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });
  } catch (error) {
    console.error('User orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
