'use client';

import { Color } from '@prisma/client';
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
import { colorFormSchema } from '@/types/zod-schema';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type ColorFormProps = { initialData: Color | null };
type ColorFormValues = z.infer<typeof colorFormSchema>;

export const ColorForm = ({ initialData }: ColorFormProps) => {
	const params = useParams();
	const router = useRouter();
	const form = useForm<ColorFormValues>({
		resolver: zodResolver(colorFormSchema),
		defaultValues: initialData ?? { name: '', value: '' },
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const baseUrl = `${params.storeId}/colors`;
	const apiBaseUrl = `/api/${baseUrl}`;

	const onSubmit = async (data: ColorFormValues) => {
		try {
			setIsLoading(true);

			initialData
				? await axios.patch(`${apiBaseUrl}/${params.colorId}`, data)
				: await axios.post(apiBaseUrl, data);

			router.refresh();
			router.push(`/${baseUrl}`);
			toast.success(initialData ? 'Color updated.' : 'Color created.');
		} catch {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`${apiBaseUrl}/${params.colorId}`);
			router.refresh();
			router.push(`/${baseUrl}`);
			toast.success('Color deleted.');
		} catch {
			toast.error(
				'Make sure you removed all products using this color first.'
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
					title={initialData ? 'Edit color' : 'Create color'}
					description={
						initialData ? 'Edit a color' : 'Add a new color'
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
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Color name'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>

									<FormControl>
										<div className='flex items-center gap-x-4'>
											<Input
												disabled={isLoading}
												placeholder='Color value'
												{...field}
											/>

											<div
												className='border p-4 rounded-full'
												style={{
													backgroundColor:
														field.value,
												}}
											/>
										</div>
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
		</>
	);
};
