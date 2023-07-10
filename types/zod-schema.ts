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

export const productFormSchema = z.object({
	name: requiredString,
	images: z.object({ url: z.string() }).array(),
	price: z.coerce.number().min(1),
	categoryId: requiredString,
	sizeId: requiredString,
	colorId: requiredString,
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
});
