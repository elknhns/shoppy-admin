'use client';

import { Copy, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from './skeleton';

export type ApiAlertProps = {
	title: string;
	description: string;
	variant: 'public' | 'admin';
	isLoading?: boolean;
};

const textMap: Record<ApiAlertProps['variant'], string> = {
	public: 'Public',
	admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive',
};

export const ApiAlert = ({
	title,
	description,
	variant,
	isLoading,
}: ApiAlertProps) => {
	const onCopy = () => {
		navigator.clipboard.writeText(description);
		toast.success('API Route copied to the clipboard.');
	};

	return (
		<Alert>
			<Server className='h-4 w-4' />

			<AlertTitle className='flex items-center gap-x-2'>
				{title}
				<Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
			</AlertTitle>

			<AlertDescription className='mt-4 flex justify-between items-center'>
				{isLoading ? (
					<Skeleton className='w-full max-w-3xl h-6' />
				) : (
					<code className='bg-muted rounded px-[0.3rem] py-[0.2rem] relative font-semibold'>
						{description}
					</code>
				)}

				<Button
					size='icon'
					variant='outline'
					onClick={onCopy}
					disabled={isLoading}
				>
					<Copy className='w-4 h-4' />
				</Button>
			</AlertDescription>
		</Alert>
	);
};
