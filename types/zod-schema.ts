import * as z from 'zod';

const requiredString = z.string().min(1);

export const commonFormSchema = z.object({ name: requiredString });

export const billboardFormSchema = z.object({
	label: requiredString,
	imageUrl: requiredString,
});

export const categoryFormSchema = z.object({
	name: requiredString,
	billboardId: requiredString,
});

export const sizeFormSchema = z.object({
	name: requiredString,
	value: requiredString,
});

export const colorFormSchema = z.object({
	name: requiredString,
	value: z
		.string()
		.min(4)
		.regex(/^#/, { message: 'String must be a valid hex code' }),
});
