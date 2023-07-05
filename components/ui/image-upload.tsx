'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

type ImageUploadProps = {
	value: string[];
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	disabled?: boolean;
};

export default function ImageUpload(props: ImageUploadProps) {
	const { value, onChange, onRemove, disabled } = props;
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	const onUpload = (result: { info: { secure_url: string } }) =>
		onChange(result.info.secure_url);

	return (
		isMounted && (
			<div>
				<div className='mb-4 flex items-center gap-4'>
					{value.map((url) => (
						<div
							key={url}
							className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
						>
							<div className='z-10 absolute top-2 right-2'>
								<Button
									variant='destructive'
									size='icon'
									onClick={() => onRemove(url)}
								>
									<Trash className='h-4 w-4' />
								</Button>
							</div>

							<Image
								fill
								className='object-cover'
								alt='Image'
								src={url}
							/>
						</div>
					))}
				</div>

				<CldUploadWidget onUpload={onUpload} uploadPreset='ydk04axh'>
					{({ open }) => (
						<Button
							variant='secondary'
							disabled={disabled}
							onClick={() => open()}
						>
							<ImagePlus className='h-4 w-4 mr-2' />
							Upload an Image
						</Button>
					)}
				</CldUploadWidget>
			</div>
		)
	);
}
