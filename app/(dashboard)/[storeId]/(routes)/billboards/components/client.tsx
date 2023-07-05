'use client';

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export const BillboardClient = () => {
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title='Billboards (0)'
					description='Manage billboards for your store'
				/>

				<Button asChild>
					<Link href={`/${params.storeId}/billboards/new`}>
						<Plus className='h-4 w-4 mr-2' />
						Add New
					</Link>
				</Button>
			</div>

			<Separator />
		</>
	);
};
