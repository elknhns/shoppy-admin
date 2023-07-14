'use client';

import { Category, Color, Image, Product, Size } from '@prisma/client';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { productFormSchema } from '@/types/zod-schema';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ImageUpload from '@/components/ui/image-upload';
import { SafeProduct } from '@/types/safe-entity';

type ProductFromProps = {
	initialData: (SafeProduct & { images: Image[] }) | null;
	categories: Category[];
	colors: Color[];
	sizes: Size[];
};

type ProductFormValues = z.infer<typeof productFormSchema>;

export const ProductForm = (props: ProductFromProps) => {
	const { initialData, categories, colors, sizes } = props;
	const params = useParams();
	const router = useRouter();
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: initialData
			? { ...initialData, price: parseFloat(String(initialData.price)) }
			: {
					name: '',
					images: [],
					price: 0,
					categoryId: '',
					colorId: '',
					sizeId: '',
					isFeatured: false,
					isArchived: false,
			  },
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const baseUrl = `${params.storeId}/products`;
	const apiBaseUrl = `/api/${baseUrl}`;

	const onSubmit = async (data: ProductFormValues) => {
		try {
			setIsLoading(true);

			initialData
				? await axios.patch(`${apiBaseUrl}/${params.productId}`, data)
				: await axios.post(apiBaseUrl, data);

			router.refresh();
			router.push(`/${baseUrl}`);
			toast.success(
				initialData ? 'Product updated.' : 'Product created.'
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
			await axios.delete(`${apiBaseUrl}/${params.productId}`);
			router.refresh();
			router.push(`/${baseUrl}`);
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
				isLoading={isLoading}
				onClose={() => setIsOpen(false)}
				onConfirm={onDelete}
			/>

			<div className='flex items-center justify-between'>
				<Heading
					title={initialData ? 'Edit product' : 'Create product'}
					description={
						initialData ? 'Edit a product' : 'Add a new product'
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
						name='images'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Images</FormLabel>

								<FormControl>
									<ImageUpload
										value={field.value.map(
											(image) => image.url
										)}
										disabled={isLoading}
										onChange={(url) =>
											field.onChange([
												...field.value,
												{ url },
											])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter(
													(image) => image.url !== url
												),
											])
										}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

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
											placeholder='Product name'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>

									<FormControl>
										<Input
											type='number'
											disabled={isLoading}
											placeholder='9.99'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='categoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>

									<Select
										value={field.value}
										defaultValue={field.value}
										onValueChange={field.onChange}
										disabled={isLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a category' />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{categories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='sizeId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>

									<Select
										value={field.value}
										defaultValue={field.value}
										onValueChange={field.onChange}
										disabled={isLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a size' />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{sizes.map((size) => (
												<SelectItem
													key={size.id}
													value={size.id}
												>
													{size.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='colorId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>

									<Select
										value={field.value}
										defaultValue={field.value}
										onValueChange={field.onChange}
										disabled={isLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a color' />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{colors.map((color) => (
												<SelectItem
													key={color.id}
													value={color.id}
												>
													{color.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='isFeatured'
							render={({ field }) => (
								<FormItem className='flex items-start space-x-3 space-y-0 border rounded-md p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-expect-error issue with react-hook-form
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className='space-y-1 leading-none'>
										<FormLabel>Featured</FormLabel>

										<FormDescription>
											This product will appear on the home
											page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='isArchived'
							render={({ field }) => (
								<FormItem className='flex items-start space-x-3 space-y-0 border rounded-md p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-expect-error issue with react-hook-form
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className='space-y-1 leading-none'>
										<FormLabel>Archived</FormLabel>

										<FormDescription>
											This product will not appear
											anywhere in the store
										</FormDescription>
									</div>
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
