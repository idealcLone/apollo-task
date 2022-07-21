import { useEffect, useState } from 'react';
import { client } from '../apollo-client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

const Login = () => {
	const router = useRouter();

	const [user, setUser] = useState({
		email: '',
		password: ''
	});

	const [error, setError] = useState('');

	useEffect(() => {
		localStorage.removeItem('token');
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value
		})
	};

	const handleLogin = async () => {
		try {
			const { data } = await client.mutate({
				mutation: gql`
					mutation {
						login(email: "${user.email}", password: "${user.password}") {
							token
						}
					}
				`,
			});

			localStorage.setItem('token', data.login.token);
			router.push('/').then(() => {
				window.location.reload();
			});
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div>
			<input
				type="email"
				name="email"
				value={user.email}
				onChange={handleChange}
				placeholder="Email"
			/>
			<input
				type="password"
				name="password"
				value={user.password}
				onChange={handleChange}
				placeholder="Password"
			/>
			{error && <p>{error}</p>}
			<button onClick={handleLogin}>Login</button>
		</div>
	);
};

export default Login;