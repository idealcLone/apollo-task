import classes from './Header.module.scss';
import { useRouter } from 'next/router';

export const Header = () => {
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem('token');
		router.push('/').then(() => window.location.reload());
	};

	return (
		<header className={classes['header']}>
			<button onClick={handleLogout}>Logout</button>
		</header>
	);
};