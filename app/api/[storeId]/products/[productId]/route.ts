import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { productFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type ProductParams = { params: { storeId: string; productId: string } };

export const GET = async (
	req: Request,
	{ params }: { params: { productId: string } }
) => {
	try {
		if (!params.productId)
			return new NextResponse('Product ID is required', {
				status: 400,
			});

		const product = await prismadb.product.findUnique({
			where: { id: params.productId },
			include: { images: true, category: true, color: true, size: true },
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error('[PRODUCT_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: ProductParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.productId)
			return new NextResponse('Product ID is required', {
				status: 400,
			});

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const { images, ...rest } = productFormSchema.parse(await req.json());

		await prismadb.product.update({
			where: { id: params.productId },
			data: { ...rest, images: { deleteMany: {} } },
		});

		const product = await prismadb.product.update({
			where: { id: params.productId },
			data: { images: { createMany: { data: images } } },
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error('[PRODUCT_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: ProductParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.productId)
			return new NextResponse('Product ID is required', {
				status: 400,
			});

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const product = await prismadb.product.deleteMany({
			where: { id: params.productId },
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error('[PRODUCT_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
