import { Product } from '@prisma/client';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';


export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export const toSafeProduct = <TData extends Product>(product: TData) => ({
	...product,
	price: Number(product?.price ?? 0),
});
