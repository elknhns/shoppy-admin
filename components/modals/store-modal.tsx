'use client';

import { Store } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { formSchema } from '@/types/zod-schema';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';

export const StoreModal = () => {
	const { isOpen, onClose } = useStoreModal();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '' },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true);
			const response = await axios.post<Store>('/api/stores', {name: ''});
			window.location.assign(`/${response.data.id}`);
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			title='Create store'
			description='Add a new store to manage products and categories'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='py-2 pb-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>

										<FormControl>
											<Input
												placeholder='E-Commerce'
												disabled={isLoading}
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='pt-6 space-x-2 flex items-center justify-end'>
								<Button variant='outline' onClick={onClose}>
									Cancel
								</Button>

								<Button type='submit'>Continue</Button>
							</div>
						</form>
					</Form>
			</div>
		</Modal>
	);
};
