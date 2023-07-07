import * as z from 'zod';

export const commonFormSchema = z.object({ name: z.string().min(1) });

export const billboardFormSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

export const categoryFormSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1),
});

export const sizeFormSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
});
