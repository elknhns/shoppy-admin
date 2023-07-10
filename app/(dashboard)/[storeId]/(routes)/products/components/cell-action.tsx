'use client';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { AlertModal } from '@/components/modals/alert-modal';
import { ProductColumn } from './columns';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CellActionProps = { data: ProductColumn };

const onCopy = (id: string) => {
	navigator.clipboard.writeText(id);
	toast.success('Product ID copied to the clipboard.');
};

export const CellAction = ({ data }: CellActionProps) => {
	const router = useRouter();
	const params = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/${params.storeId}/products/${data.id}`);
			router.refresh();
			toast.success('Product deleted.');
		} catch {
			toast.error('Something went wrong.');
		} finally {
			setIsLoading(false);
			setIsOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={onDelete}
				isLoading={isLoading}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => onCopy(data.id)}
					>
						<Copy className='h-4 w-4 mr-2' />
						Copy Id
					</DropdownMenuItem>

					<DropdownMenuItem className='cursor-pointer' asChild>
						<Link href={`products/${data.id}`}>
							<Edit className='h-4 w-4 mr-2' />
							Update
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => setIsOpen(true)}
					>
						<Trash className='h-4 w-4 mr-2' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
