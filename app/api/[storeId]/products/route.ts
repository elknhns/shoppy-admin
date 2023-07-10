import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { productFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type ProductsParams = { params: { storeId: string } };

export const GET = async (req: Request, { params }: ProductsParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { searchParams } = new URL(req.url);

		const products = await prismadb.product.findMany({
			where: {
				...params,
				categoryId: searchParams.get('categoryId') ?? undefined,
				colorId: searchParams.get('colorId') ?? undefined,
				sizeId: searchParams.get('sizeId') ?? undefined,
				isFeatured: searchParams.get('isFeatured') ? true : undefined,
				isArchived: false,
			},
			include: { images: true, category: true, color: true, size: true },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(products);
	} catch (error) {
		console.error('[PRODUCTS_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const POST = async (req: Request, { params }: ProductsParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const { images, ...rest } = productFormSchema.parse(await req.json());

		const product = await prismadb.product.create({
			data: {
				...rest,
				...params,
				images: { createMany: { data: images } },
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.error('[PRODUCTS_POST]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};
