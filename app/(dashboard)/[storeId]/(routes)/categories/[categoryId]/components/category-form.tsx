'use client';

import { Billboard, Category } from '@prisma/client';
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
import { categoryFormSchema } from '@/types/zod-schema';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type CategoryFormProps = {
	initialData: Category | null;
	billboards: Billboard[];
};
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CategoryForm = (props: CategoryFormProps) => {
	const { initialData, billboards } = props;
	const params = useParams();
	const router = useRouter();
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: initialData ?? { name: '', billboardId: '' },
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const baseUrl = `${params.storeId}/categories`;
	const apiBaseUrl = `/api/${baseUrl}`;

	const onSubmit = async (data: CategoryFormValues) => {
		try {
			setIsLoading(true);

			initialData
				? await axios.patch(`${apiBaseUrl}/${params.categoryId}`, data)
				: await axios.post(apiBaseUrl, data);

			router.refresh();
			router.push(`/${baseUrl}`);
			toast.success(
				initialData ? 'Category updated.' : 'Category created.'
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
			await axios.delete(`${apiBaseUrl}/${params.categoryId}`);
			router.refresh();
			router.push(`/${baseUrl}`);
			toast.success('Category deleted.');
		} catch {
			toast.error(
				'Make sure you removed all products using this category first.'
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
					title={initialData ? 'Edit category' : 'Create category'}
					description={
						initialData ? 'Edit a category' : 'Add a new category'
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
											placeholder='Category Name'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='billboardId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Billboard</FormLabel>

									<Select
										value={field.value}
										defaultValue={field.value}
										onValueChange={field.onChange}
										disabled={isLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a billboard' />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{billboards.map((billboard) => (
												<SelectItem
													key={billboard.id}
													value={billboard.id}
												>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

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
