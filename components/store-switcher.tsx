'use client';

import {
	Check,
	ChevronsUpDown,
	PlusCircle,
	Store as StoreIcon,
} from 'lucide-react';
import { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { Store } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/use-store-modal';

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;
type StoreSwitcherProps = PopoverTriggerProps & { stores: Store[] };

export default function StoreSwitcher(props: StoreSwitcherProps) {
	const { className, stores: stores = [] } = props;
	const storeModal = useStoreModal();
	const params = useParams();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const formattedStores = useMemo(
		() => stores.map((store) => ({ label: store.name, value: store.id })),
		[stores]
	);

	const currentStore = useMemo(
		() => formattedStores.find((store) => store.value === params.storeId),
		[formattedStores, params.storeId]
	);

	const onStoreSelect = (store: { value: string; label: string }) => {
		setIsOpen(false);
		router.push(`/${store.value}`);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					role='combobox'
					aria-expanded={isOpen}
					aria-label='Select a store'
					className={cn('w-[200px] justify-between', className)}
				>
					<StoreIcon className='mr-2 h-4 w-4' />
					{currentStore?.label}
					<ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandList>
						<CommandInput placeholder='Search store...' />
						<CommandEmpty>No store found.</CommandEmpty>
						<CommandGroup heading='Stores'>
							{formattedStores.map((store) => (
								<CommandItem
									key={store.value}
									onSelect={() => onStoreSelect(store)}
									className='text-sm'
								>
									<StoreIcon className='mr-2 h-4 w-4' />
									{store.label}

									<Check
										className={cn(
											'ml-auto h-4 w-4',
											currentStore?.value === store.value
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>

					<CommandSeparator />

					<CommandList>
						<CommandGroup>
							<CommandItem
								className='cursor-pointer'
								onSelect={() => {
									setIsOpen(false);
									storeModal.onOpen();
								}}
							>
								<PlusCircle className='mr-2 h-5 w-5' />
								Create Store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
