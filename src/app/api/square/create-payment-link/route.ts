// app/api/square/create-payment-link/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure non-cached API on Vercel
const SQUARE_VERSION = '2024-08-21';

type SingleItem = { name: string; price: number; quantity?: number };
type CartItem = {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  imageUrl?: string;
};

function cents(n: number | undefined | null) {
  return Math.max(0, Math.round(Number(n || 0) * 100));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      item?: SingleItem;     // Product page usage
      items?: CartItem[];    // Cart page usage
      taxRatePercent?: number | string;
      shipping?: number;
    };

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId  = process.env.SQUARE_LOCATION_ID;
    const redirectUrl = process.env.CHECKOUT_REDIRECT_URL; // optional

    if (!accessToken || !locationId) {
      return NextResponse.json(
        { error: 'Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID env vars.' },
        { status: 500 }
      );
    }

    const { item, items, taxRatePercent, shipping } = body;

    // ✅ Build product line items
    let line_items: any[] = [];
    if (item) {
      line_items.push({
        name: item.name || 'Item',
        quantity: String(Math.max(1, item.quantity || 1)),
        base_price_money: { amount: cents(item.price), currency: 'USD' },
      });
    } else if (Array.isArray(items) && items.length > 0) {
      line_items = items.map((it) => ({
        name: [
          it.name,
          it.selectedSize && `(Size: ${it.selectedSize})`,
          it.selectedColor && `(Color: ${it.selectedColor})`,
        ].filter(Boolean).join(' '),
        quantity: String(Math.max(1, Number(it.quantity || 1))),
        base_price_money: { amount: cents(it.price), currency: 'USD' },
      }));
    } else {
      return NextResponse.json({ error: 'No valid items provided.' }, { status: 400 });
    }

    const order: any = {
      location_id: locationId,
      line_items,
    };

    // ✅ Tax at order level — does NOT count as item
    const taxPctStr =
      taxRatePercent === 0 || taxRatePercent === '0'
        ? undefined
        : String(taxRatePercent ?? '');

    if (taxPctStr && !Number.isNaN(Number(taxPctStr))) {
      order.taxes = [
        {
          uid: 'order_tax',
          name: 'Tax',
          percentage: taxPctStr,
          scope: 'ORDER',
          type: 'ADDITIVE',
        },
      ];
    }

    // ✅ Shipping at order level — does NOT count as item
    if (shipping && cents(shipping) > 0) {
      order.service_charges = [
        {
          uid: 'shipping_charge',
          name: 'Shipping',
          amount_money: { amount: cents(shipping), currency: 'USD' },
          calculation_phase: 'TOTAL_PHASE',
          taxable: false,
        },
      ];
    }

    // ✅ Tell Square this order will ship (this allows shipping address field)
    order.fulfillments = [
      {
        uid: 'SHIP',
        type: 'SHIPMENT',
        state: 'PROPOSED',
      },
    ];

    const payload: any = {
      idempotency_key: crypto.randomUUID(),
      order,
      checkout_options: {
        ask_for_shipping_address: true, // ✅ Required in US e-commerce
      },
    };

    // Optional customer redirect after payment success
    if (redirectUrl) {
      payload.checkout_options.redirect_url = redirectUrl;
    }

    const resp = await fetch(
      'https://connect.squareup.com/v2/online-checkout/payment-links',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Square-Version': SQUARE_VERSION,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data?.errors?.[0]?.detail ?? 'Square error', raw: data },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 }); // ✅ success
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Unexpected server error' },
      { status: 500 }
    );
  }
}
