import { MoreHorizontal } from 'lucide-react';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const OrdersLoading = () => (
	<div className='p-8 pt-6 space-y-4'>
		<Heading title='Orders' description='Manage orders for your store' />

		<Separator />

		<div>
			<div className='py-4'>
				<Input placeholder='Search...' disabled className='max-w-sm' />
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Products</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Total price</TableHead>
							<TableHead>Paid</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: 3 }).map(() => (
							<TableRow key={crypto.randomUUID()}>
								<TableCell>
									<Skeleton className='h-4' />
								</TableCell>

								<TableCell>
									<Skeleton className='h-4' />
								</TableCell>

								<TableCell>
									<Skeleton className='h-4' />
								</TableCell>

								<TableCell>
									<Skeleton className='h-4' />
								</TableCell>

								<TableCell>
									<Skeleton className='h-4' />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button variant='outline' size='sm' disabled>
					Previous
				</Button>

				<Button variant='outline' size='sm' disabled>
					Next
				</Button>
			</div>
		</div>
	</div>
);

export default OrdersLoading;
