import { auth } from '@clerk/nextjs';
import { formSchema } from '@/types/zod-schema';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import prismadb from '@/lib/prismadb';

export const PATCH = async (
	req: Request,
	{ params }: { params: { storeId: string } }
) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		const { name } = formSchema.parse(await req.json());

		const store = await prismadb.store.updateMany({
			where: { id: params.storeId, userId },
			data: { name },
		});

		return NextResponse.json(store);
	} catch (error) {
		console.error('[STORE_PATCH]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};

export const DELETE = async (
	req: Request,
	{ params }: { params: { storeId: string } }
) => {
	try {
		if (!params.storeId)
			return new NextResponse('Store ID is required', { status: 400 });

		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		const store = await prismadb.store.deleteMany({
			where: { id: params.storeId, userId },
		});

		return NextResponse.json(store);
	} catch (error) {
		console.error('[STORE_DELETE]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
};
