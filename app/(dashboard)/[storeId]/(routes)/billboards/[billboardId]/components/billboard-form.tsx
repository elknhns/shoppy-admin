'use client';

import { Billboard } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { billboardFormSchema } from '@/types/zod-schema';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ImageUpload from '@/components/ui/image-upload';

type BillboardFormProps = { initialData: Billboard | null };
type BillboardFormValues = z.infer<typeof billboardFormSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
	const params = useParams();
	const router = useRouter();
	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(billboardFormSchema),
		defaultValues: initialData ?? { label: '', imageUrl: '' },
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const baseUrl = `/api/${params.storeId}/billboards`;

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setIsLoading(true);

			initialData
				? await axios.patch(`${baseUrl}/${params.billboardId}`, data)
				: await axios.post(baseUrl, data);

			router.refresh();
			router.push(`/${params.storeId}/billboards`);
			toast.success(
				initialData ? 'Billboard updated.' : 'Billboard created.'
			);
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`${baseUrl}/${params.billboardId}`);
			router.refresh();
			router.push('/');
			toast.success('Billboard deleted.');
		} catch {
			toast.error(
				'Make sure you removed all categories using this billboard first.'
			);
		} finally {
			setIsLoading(false);
			setIsOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={isOpen}
				isLoading={isLoading}
				onClose={() => setIsOpen(false)}
				onConfirm={onDelete}
			/>

			<div className='flex items-center justify-between'>
				<Heading
					title={initialData ? 'Edit billboard' : 'Create billboard'}
					description={
						initialData ? 'Edit a billboard' : 'Add a new billboard'
					}
				/>

				{initialData && (
					<Button
						variant='destructive'
						size='icon'
						disabled={isLoading}
						onClick={() => setIsOpen(true)}
					>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>

			<Separator />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8'
				>
					<FormField
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background Image</FormLabel>

								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={isLoading}
										onChange={field.onChange}
										onRemove={() => field.onChange('')}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>

									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Billboard label'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button type='submit' disabled={isLoading}>
						{initialData ? 'Save changes' : 'Create'}
					</Button>
				</form>
			</Form>

			<Separator />
		</>
	);
};
