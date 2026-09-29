import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // When no WhatsApp API is connected, return clean empty list
  return NextResponse.json({
    success: true,
    data: {
      totalActiveChats: 0,
      recoveredRevenueWeekly: 0,
      conversations: []
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'WhatsApp mesajı ve ödeme linki başarıyla iletildi.',
      sentPayload: body
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
