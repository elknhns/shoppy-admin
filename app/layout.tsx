import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { ModalProvider } from '@/providers/modal-provider';
import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Admin Dashboard',
	description: 'Admin Dashboard',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
	<ClerkProvider>
		<html lang='en'>
			<body className={inter.className}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
				>
					<Toaster />
					<ModalProvider />
					{children}
				</ThemeProvider>
			</body>
		</html>
	</ClerkProvider>
);

export default RootLayout;
