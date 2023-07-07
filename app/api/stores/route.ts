import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { commonFormSchema } from '@/types/zod-schema';
import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', { status: 401 });

		const body = commonFormSchema.parse(await req.json());

		const store = await prismadb.store.create({
			data: { ...body, userId },
		});

		return NextResponse.json(store);
	} catch (error) {
		console.error('[STORES_POST]', error);
		if (error instanceof ZodError)
			return new NextResponse(error.message, { status: 400 });
		return new NextResponse('Internal Error', { status: 500 });
	}
};
