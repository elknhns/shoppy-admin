import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { paymentSchema } from '@/types/zod-schema';
import { stripe } from '@/lib/stripe';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const OPTIONS = () => NextResponse.json({}, { headers: corsHeaders });

export const POST = async (
	req: Request,
	{ params }: { params: { storeId: string } }
) => {
	const { productIds } = paymentSchema.parse(await req.json());

	const products = await prismadb.product.findMany({
		where: { id: { in: productIds } },
	});

	const order = await prismadb.order.create({
		data: {
			storeId: params.storeId,
			isPaid: false,
			orderItems: {
				create: productIds.map((id) => ({
					product: { connect: { id } },
				})),
			},
		},
	});

	const session = await stripe.checkout.sessions.create({
		line_items: products.map((product) => ({
			quantity: 1,
			price_data: {
				currency: 'USD',
				product_data: { name: product.name },
				unit_amount: Number(product.price) * 100,
			},
		})),
		mode: 'payment',
		billing_address_collection: 'required',
		phone_number_collection: { enabled: true },
		success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
		cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
		metadata: { orderId: order.id },
	});

	return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
