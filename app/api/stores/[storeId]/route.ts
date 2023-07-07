import { auth } from '@clerk/nextjs';
import { commonFormSchema } from '@/types/zod-schema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import prismadb from '@/lib/prismadb';

type StoreParams = { params: { storeId: string } };

export const PATCH = async (req: Request, { params }: StoreParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const store = await prismadb.store.updateMany({
			where: { id: params.storeId, userId },
			data: commonFormSchema.parse(await req.json()),
		});

		return NextResponse.json(store);
	} catch (error) {
		console.error('[STORE_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: StoreParams) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const store = await prismadb.store.deleteMany({
			where: { id: params.storeId, userId },
		});

		return NextResponse.json(store);
	} catch (error) {
		console.error('[STORE_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
