import { ProductForm } from './components/product-form';
import { toSafeProduct } from '@/lib/utils';
import prismadb from '@/lib/prismadb';

type ProductPageProps = { params: { productId: string; storeId: string } };

export default async function ProductPage({ params }: ProductPageProps) {
	const [product, categories, colors, sizes] = await Promise.all([
		prismadb.product.findUnique({
			where: { id: params.productId },
			include: { images: true },
		}),
		prismadb.category.findMany({
			where: { storeId: params.storeId },
		}),
		prismadb.color.findMany({
			where: { storeId: params.storeId },
		}),
		prismadb.size.findMany({
			where: { storeId: params.storeId },
		}),
	]);

	const safeProduct = product ? toSafeProduct(product) : null;

	return (
		<div className='p-8 pt-6 space-y-4'>
			<ProductForm
				initialData={safeProduct}
				categories={categories}
				colors={colors}
				sizes={sizes}
			/>
		</div>
	);
}
