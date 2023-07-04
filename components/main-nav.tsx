'use client';

import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type Route = { href: string; label: string; active: boolean };

export const MainNav = (props: React.HTMLAttributes<HTMLElement>) => {
	const { className, ...rest } = props;
	const pathname = usePathname();
	const params = useParams();

	const routes: Route[] = [
		{
			href: `/${params.storeId}`,
			label: 'Overview',
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
		},
	];

	return (
		<nav
			className={cn(
				'flex items-center space-x-4 lg:space-x-6',
				className
			)}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
						route.active
							? 'text-black dark:text-white'
							: 'text-muted-foreground'
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
};
