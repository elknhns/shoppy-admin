'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { OrderColumn, columns } from './columns';
import { Separator } from '@/components/ui/separator';

type OrderClientProps = { data: OrderColumn[] };

export const OrderClient = ({ data }: OrderClientProps) => (
	<>
		<Heading
			title={`Orders (${data.length})`}
			description='Manage orders for your store'
		/>

		<Separator />

		<DataTable columns={columns} data={data} searchKey='products' />
	</>
);
