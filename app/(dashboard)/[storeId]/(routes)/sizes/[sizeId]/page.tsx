import { SizeForm } from './components/size-form';
import prismadb from '@/lib/prismadb';

type SizePageProps = { params: { sizeId: string } };

export default async function SizePage({ params }: SizePageProps) {
	const size = await prismadb.size.findUnique({
		where: { id: params.sizeId },
	});

	return (
		<div className='p-8 pt-6 space-y-4'>
			<SizeForm initialData={size} />
		</div>
	);
}
