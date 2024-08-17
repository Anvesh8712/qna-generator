import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

const formatAmountforStripe = (amount) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  const params = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: formatAmountforStripe(10),
          product_data: {
            name: "Pro Subscription",
          },
          recurring: {
            interval: "month",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get(
      "origin"
    )}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get(
      "origin"
    )}/result?session_id={CHECKOUT_SESSION_ID}`,
  };

  const checkoutSession = await stripe.checkout.sessions.create(params);

  return NextResponse.json(checkoutSession, {
    status: 200,
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
