import { create } from 'zustand';

export type UseStoreModal = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useStoreModal = create<UseStoreModal>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
