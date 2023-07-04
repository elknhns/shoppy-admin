'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

type ModalProps = {
	title: string;
	description: string;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
};

export const Modal = ({
	title,
	description,
	isOpen,
	onClose,
	children,
}: ModalProps) => (
	<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>

			<div>{children}</div>
		</DialogContent>
	</Dialog>
);
