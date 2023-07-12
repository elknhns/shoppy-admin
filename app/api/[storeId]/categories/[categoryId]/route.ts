import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { categoryFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type CategoryParams = { params: { storeId: string; categoryId: string } };

export const GET = async (
	req: Request,
	{ params }: { params: { categoryId: string } }
) => {
	try {
		if (!params.categoryId)
			return new NextResponse('Category ID is required', {
				status: 400,
			});

		const category = await prismadb.category.findUnique({
			where: { id: params.categoryId },
			include: { billboard: true },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.error('[CATEGORY_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: CategoryParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.categoryId)
			return new NextResponse('Category ID is required', {
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

		const category = await prismadb.category.updateMany({
			where: { id: params.categoryId },
			data: categoryFormSchema.parse(await req.json()),
		});

		return NextResponse.json(category);
	} catch (error) {
		console.error('[CATEGORY_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: CategoryParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.categoryId)
			return new NextResponse('Category ID is required', {
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

		const category = await prismadb.category.deleteMany({
			where: { id: params.categoryId },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.error('[CATEGORY_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
