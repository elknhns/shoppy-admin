import { auth } from '@clerk/nextjs';
import { categoryFormSchema } from '@/types/zod-schema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import prismadb from '@/lib/prismadb';

type CategoriesParams = { params: { storeId: string } };

export const GET = async (req: Request, { params }: CategoriesParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const categories = await prismadb.category.findMany({ where: params });

		return NextResponse.json(categories);
	} catch (error) {
		console.error('[CATEGORIES_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const POST = async (req: Request, { params }: CategoriesParams) => {
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

		const body = categoryFormSchema.parse(await req.json());

		const category = await prismadb.category.create({
			data: { ...body, ...params },
		});

		return NextResponse.json(category);
	} catch (error) {
		console.error('[CATEGORIES_POST]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};
