import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { sizeFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type SizesParams = { params: { storeId: string } };

export const GET = async (req: Request, { params }: SizesParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const sizes = await prismadb.size.findMany({ where: params });

		return NextResponse.json(sizes);
	} catch (error) {
		console.error('[SIZES_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const POST = async (req: Request, { params }: SizesParams) => {
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

		const body = sizeFormSchema.parse(await req.json());

		const size = await prismadb.size.create({
			data: { ...body, ...params },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.error('[SIZES_POST]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};
