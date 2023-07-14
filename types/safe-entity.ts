import { Product } from '@prisma/client';

export type SafeProduct = Omit<Product, 'price'> & { price: number };