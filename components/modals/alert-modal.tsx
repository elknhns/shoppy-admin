'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { UseStoreModal } from '@/hooks/use-store-modal';
import { on } from 'events';

type AlertModalProps = Omit<UseStoreModal, 'onOpen'> & {
	onConfirm: () => void;
	isLoading: boolean;
};

export const AlertModal = (props: AlertModalProps) => {
	const { onConfirm, isLoading, onClose, isOpen } = props;
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	return (
		isMounted && (
			<Modal
				title='Are you sure?'
				description='This action cannot be undone.'
				isOpen={isOpen}
				onClose={onClose}
			>
				<div className='pt-6 flex justify-end gap-2 w-full'>
					<Button
						disabled={isLoading}
						variant='outline'
						onClick={onClose}
					>
						Cancel
					</Button>

					<Button
						disabled={isLoading}
						variant='destructive'
						onClick={onConfirm}
					>
						Continue
					</Button>
				</div>
			</Modal>
		)
	);
};
