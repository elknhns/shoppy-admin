import { ColorForm } from './components/color-form';
import prismadb from '@/lib/prismadb';

type ColorPageProps = { params: { colorId: string } };

export default async function ColorPage({ params }: ColorPageProps) {
	const color = await prismadb.color.findUnique({
		where: { id: params.colorId },
	});

	return (
		<div className='p-8 pt-6 space-y-4'>
			<ColorForm initialData={color} />
		</div>
	);
}
