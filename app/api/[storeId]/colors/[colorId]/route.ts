import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { colorFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type ColorParams = { params: { storeId: string; colorId: string } };

export const GET = async (
	req: Request,
	{ params }: { params: { colorId: string } }
) => {
	try {
		if (!params.colorId)
			return new NextResponse('Color ID is required', {
				status: 400,
			});

		const color = await prismadb.color.findUnique({
			where: { id: params.colorId },
		});

		return NextResponse.json(color);
	} catch (error) {
		console.error('[COLOR_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: ColorParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.colorId)
			return new NextResponse('Color ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const color = await prismadb.color.updateMany({
			where: { id: params.colorId },
			data: colorFormSchema.parse(await req.json()),
		});

		return NextResponse.json(color);
	} catch (error) {
		console.error('[COLOR_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: ColorParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.colorId)
			return new NextResponse('Color ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const color = await prismadb.color.deleteMany({
			where: { id: params.colorId },
		});

		return NextResponse.json(color);
	} catch (error) {
		console.error('[COLOR_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
