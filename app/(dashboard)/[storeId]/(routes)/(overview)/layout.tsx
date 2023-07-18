import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
	<div className='space-y-4 p-8 pt-6'>
		<Heading title='Dashboard' description='Overview of your store' />
		<Separator />
		{children}
	</div>
);

export default DashboardLayout;
