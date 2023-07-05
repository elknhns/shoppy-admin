import { BillboardForm } from './components/billboard-form';
import prismadb from '@/lib/prismadb';

type BillboardPageProps = { params: { billboardId: string } };

export default async function BillboardPage({ params }: BillboardPageProps) {
	const billboard = await prismadb.billboard.findUnique({
		where: { id: params.billboardId },
	});

	return (
		<div className='p-8 pt-6 space-y-4'>
			<BillboardForm initialData={billboard} />
		</div>
	);
}
