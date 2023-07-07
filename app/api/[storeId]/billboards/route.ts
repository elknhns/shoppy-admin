import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { billboardFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

type BillboardsParams = { params: { storeId: string } };

export const GET = async (req: Request, { params }: BillboardsParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const billboards = await prismadb.billboard.findMany({ where: params });

		return NextResponse.json(billboards);
	} catch (error) {
		console.error('[BILLBOARDS_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const POST = async (req: Request, { params }: BillboardsParams) => {
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

		const body = billboardFormSchema.parse(await req.json());

		const billboard = await prismadb.billboard.create({
			data: { ...body, ...params },
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.error('[BILLBOARDS_POST]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};
