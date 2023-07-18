import { CreditCard, DollarSign, LucideIcon, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatter } from '@/lib/utils';
import { getGraphRevenue } from '@/actions/get-graph-revenue';
import { getSalesCount } from '@/actions/get-sales-count';
import { getStockCount } from '@/actions/get-stock-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import { Overview } from '@/components/overview';

type DashboardPageProps = { params: { storeId: string } };
type Card = { title: string; icon?: LucideIcon; content: string | number };

const renderCard = ({ title, icon: Icon, content }: Card) => (
	<Card key={title}>
		<CardHeader className='flex flex-row items-center justify-between pb-2'>
			<CardTitle className='text-sm font-medium'>{title}</CardTitle>

			{Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
		</CardHeader>

		<CardContent className='text-2xl font-bold'>{content}</CardContent>
	</Card>
);

export default async function DashboardPage({ params }: DashboardPageProps) {
	const [totalRevenue, salesCount, stockCount, graphRevenue] =
		await Promise.all([
			getTotalRevenue(params.storeId),
			getSalesCount(params.storeId),
			getStockCount(params.storeId),
			getGraphRevenue(params.storeId),
		]);

	const topCards: Card[] = [
		{
			title: 'Total Revenue',
			icon: DollarSign,
			content: formatter.format(totalRevenue),
		},
		{
			title: 'Sales',
			icon: CreditCard,
			content: `+${salesCount}`,
		},
		{
			title: 'Products In Stock',
			icon: Package,
			content: stockCount,
		},
	];

	return (
		<>
			<div className='grid gap-4 grid-cols-3'>
				{topCards.map(renderCard)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Overview</CardTitle>
				</CardHeader>

				<CardContent className='pl-2'>
					<Overview data={graphRevenue} />
				</CardContent>
			</Card>
		</>
	);
}
