'use client';

import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type Route = { href: string; label: string };

export const MainNav = ({ className }: React.HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname();
	const params = useParams();

	const routes: Route[] = [
		{
			href: `/${params.storeId}`,
			label: 'Overview',
		},
		{
			href: `/${params.storeId}/billboards`,
			label: 'Billboards',
		},
		{
			href: `/${params.storeId}/categories`,
			label: 'Categories',
		},
		{
			href: `/${params.storeId}/sizes`,
			label: 'Sizes',
		},
		{
			href: `/${params.storeId}/colors`,
			label: 'Colors',
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
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
						route.href === pathname
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
