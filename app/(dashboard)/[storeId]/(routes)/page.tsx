import { CreditCard, DollarSign, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatter } from '@/lib/utils';
import { getSalesCount } from '@/actions/get-sales-count';
import { getStockCount } from '@/actions/get-stock-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import { Heading } from '@/components/ui/heading';
import { Overview } from '@/components/overview';
import { Separator } from '@/components/ui/separator';
import { getGraphRevenue } from '@/actions/get-graph-revenue';

type DashboardPageProps = { params: { storeId: string } };

export default async function DashboardPage({ params }: DashboardPageProps) {
	const [totalRevenue, salesCount, stockCount, graphRevenue] =
		await Promise.all([
			getTotalRevenue(params.storeId),
			getSalesCount(params.storeId),
			getStockCount(params.storeId),
			getGraphRevenue(params.storeId),
		]);

	return (
		<div className='space-y-4 p-8 pt-6'>
			<Heading title='Dashboard' description='Overview of your store' />
			<Separator />

			<div className='grid gap-4 grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Revenue
						</CardTitle>

						<DollarSign className='h-4 w-4 text-gray-800' />
					</CardHeader>

					<CardContent className='text-2xl font-bold'>
						{formatter.format(totalRevenue)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium'>
							Sales
						</CardTitle>

						<CreditCard className='h-4 w-4 text-muted-foreground' />
					</CardHeader>

					<CardContent className='text-2xl font-bold'>
						+{salesCount}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium'>
							Products In Stock
						</CardTitle>

						<Package className='h-4 w-4 text-muted-foreground' />
					</CardHeader>

					<CardContent className='text-2xl font-bold'>
						{stockCount}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Overview</CardTitle>
				</CardHeader>

				<CardContent className='pl-2'>
					<Overview data={graphRevenue} />
				</CardContent>
			</Card>
		</div>
	);
}
