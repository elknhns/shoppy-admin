import { auth } from '@clerk/nextjs';
import { billboardFormSchema } from '@/types/zod-schema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import prismadb from '@/lib/prismadb';

type BillboardParams = { params: { storeId: string; billboardId: string } };

export const GET = async (
	req: Request,
	{ params }: { params: { billboardId: string } }
) => {
	try {
		if (!params.billboardId)
			return new NextResponse('Billboard ID is required', {
				status: 400,
			});

		const billboard = await prismadb.billboard.findUnique({
			where: { id: params.billboardId },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.error('[BILLBOARD_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const PATCH = async (req: Request, { params }: BillboardParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.billboardId)
			return new NextResponse('Billboard ID is required', {
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

		const billboard = await prismadb.billboard.updateMany({
			where: { id: params.billboardId },
			data: billboardFormSchema.parse(await req.json()),
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.error('[BILLBOARD_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: BillboardParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		if (!params.billboardId)
			return new NextResponse('Billboard ID is required', {
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

		const billboard = await prismadb.billboard.deleteMany({
			where: { id: params.billboardId },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.error('[BILLBOARD_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
