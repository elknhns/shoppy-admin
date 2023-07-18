'use client';

import { useParams } from 'next/navigation';

import { ApiAlert, ApiAlertProps } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

type ApiListProps = {
	entityName: string;
	entityIdName: string;
	isLoading?: boolean;
};

type API = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	variant: ApiAlertProps['variant'];
	endpoint: string;
};

export const ApiList = ({
	entityName,
	entityIdName,
	isLoading,
}: ApiListProps) => {
	const params = useParams();
	const origin = useOrigin();

	const baseUrl = `${origin}/api/${params.storeId}`;

	const apis: API[] = [
		{
			method: 'GET',
			variant: 'public',
			endpoint: `${baseUrl}/${entityName}`,
		},
		{
			method: 'GET',
			variant: 'public',
			endpoint: `${baseUrl}/${entityName}/{${entityIdName}}`,
		},
		{
			method: 'POST',
			variant: 'admin',
			endpoint: `${baseUrl}/${entityName}`,
		},
		{
			method: 'PATCH',
			variant: 'admin',
			endpoint: `${baseUrl}/${entityName}/{${entityIdName}}`,
		},
		{
			method: 'DELETE',
			variant: 'admin',
			endpoint: `${baseUrl}/${entityName}/{${entityIdName}}`,
		},
	];

	return apis.map((api) => (
		<ApiAlert
			key={`${api.method}-${api.endpoint}`}
			title={api.method}
			variant={api.variant}
			description={api.endpoint}
			isLoading={isLoading || !origin}
		/>
	));
};
