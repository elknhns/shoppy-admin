'use client';

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { ProductColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';

type ProductClientProps = { data: ProductColumn[] };

export const ProductClient = ({ data }: ProductClientProps) => {
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Products (${data.length})`}
					description='Manage products for your store'
				/>

				<Button asChild>
					<Link href={`/${params.storeId}/products/new`}>
						<Plus className='h-4 w-4 mr-2' />
						Add New
					</Link>
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={data} searchKey='name' />

			<Heading title='API' description='API calls for Products' />
			<Separator />

			<ApiList entityName='products' entityIdName='productId' />
		</>
	);
};
