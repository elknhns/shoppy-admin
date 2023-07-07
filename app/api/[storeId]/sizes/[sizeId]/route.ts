import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { sizeFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type SizeParams = { params: { storeId: string; sizeId: string } };

export const GET = async (
	req: Request,
	{ params }: { params: { sizeId: string } }
) => {
	try {
		if (!params.sizeId)
			return new NextResponse('Size ID is required', {
				status: 400,
			});

		const size = await prismadb.size.findUnique({
			where: { id: params.sizeId },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.error('[SIZE_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: SizeParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.sizeId)
			return new NextResponse('Size ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const size = await prismadb.size.updateMany({
			where: { id: params.sizeId },
			data: sizeFormSchema.parse(await req.json()),
		});

		return NextResponse.json(size);
	} catch (error) {
		console.error('[SIZE_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: SizeParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.sizeId)
			return new NextResponse('Size ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', { status: 403 });

		const size = await prismadb.size.deleteMany({
			where: { id: params.sizeId },
		});

		return NextResponse.json(size);
	} catch (error) {
		console.error('[SIZE_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
