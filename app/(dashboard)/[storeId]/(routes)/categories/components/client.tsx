'use client';

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { CategoryColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type CategoryClientProps = { data: CategoryColumn[] };

export const CategoryClient = ({ data }: CategoryClientProps) => {
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Categories (${data.length})`}
					description='Manage categories for your store'
				/>

				<Button asChild>
					<Link href={`/${params.storeId}/categories/new`}>
						<Plus className='h-4 w-4 mr-2' />
						Add New
					</Link>
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={data} searchKey='name' />

			<Heading title='API' description='API calls for Categories' />
			<Separator />

			<ApiList entityName='categories' entityIdName='categoryId' />
		</>
	);
};
