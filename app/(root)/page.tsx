import { UserButton } from '@clerk/nextjs';

const SetupPage = () => (
	<div>
		<UserButton afterSignOutUrl='/' />
	</div>
);

export default SetupPage;
