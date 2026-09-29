import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // When no API integrations or customer stores are connected, return zero/clean states
  const liveStats = {
    timestamp: new Date().toISOString(),
    status: 'idle',
    currentVisitors: 0,
    activeCarts: 0,
    todaySalesCount: 0,
    todayGrossRevenue: 0,
    todayNetMargin: 0,
    liveSalesTicker: [],
    cityHeatmap: [],
    alerts: []
  };

  return NextResponse.json({
    success: true,
    data: liveStats
  });
}
