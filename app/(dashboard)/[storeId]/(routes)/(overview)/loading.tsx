import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading = () => (
	<>
		<div className='grid gap-4 grid-cols-3'>
			{Array.from({ length: 3 }).map(() => (
				<Skeleton key={crypto.randomUUID()} className='h-[8.125rem]' />
			))}
		</div>

		<Skeleton className='h-[28rem]' />
	</>
);

export default DashboardLoading;
