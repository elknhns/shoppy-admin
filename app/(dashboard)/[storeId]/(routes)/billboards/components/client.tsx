'use client';

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { ApiList } from '@/components/ui/api-list';
import { BillboardColumn, columns } from './columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type BillboardClientProps = { data: BillboardColumn[] };

export const BillboardClient = ({ data }: BillboardClientProps) => {
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Billboards (${data.length})`}
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

			<DataTable columns={columns} data={data} searchKey='label' />

			<Heading title='API' description='API calls for Billboards' />
			<Separator />

			<ApiList entityName='billboards' entityIdName='billboardId' />
		</>
	);
};
