'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStoreModal } from '@/hooks/use-store-modal';
import Modal from '@/components/ui/modal';

const formSchema = z.object({ name: z.string().min(1) });

export const StoreModal = () => {
	const { isOpen, onClose } = useStoreModal();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '' },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) =>
		console.log(values);

	return (
		<Modal
			title='Create store'
			description='Add a new store to manage products and categories'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>
				<div>
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
			</div>
		</Modal>
	);
};
