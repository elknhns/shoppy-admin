import { ProductForm } from './components/product-form';
import prismadb from '@/lib/prismadb';

type ProductPageProps = { params: { productId: string; storeId: string } };

export default async function ProductPage({ params }: ProductPageProps) {
	const product = await prismadb.product.findUnique({
		where: { id: params.productId },
		include: { images: true },
	});

	const categories = await prismadb.category.findMany({
		where: { storeId: params.storeId },
	});

	const colors = await prismadb.color.findMany({
		where: { storeId: params.storeId },
	});

	const sizes = await prismadb.size.findMany({
		where: { storeId: params.storeId },
	});

	return (
		<div className='p-8 pt-6 space-y-4'>
			<ProductForm
				initialData={product}
				categories={categories}
				colors={colors}
				sizes={sizes}
			/>
		</div>
	);
}
