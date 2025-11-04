import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  const res = await fetch(`https://connect.squareup.com/v2/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  const total = data?.order?.total_money?.amount ?? 0;

  return NextResponse.json({
    amount: total / 100,
    currency: data?.order?.total_money?.currency ?? "USD",
  });
}
