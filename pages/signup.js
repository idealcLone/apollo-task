import { useRouter } from 'next/router';
import { client } from '../apollo-client';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const Signup = () => {
	const router = useRouter();

	const [user, setUser] = useState({
		name: '',
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

	const handleSignUp = async () => {
		try {
			const { data } = await client.mutate({
				mutation: gql`
					mutation {
						signup(name: "${user.name}", email: "${user.email}", password: "${user.password}") {
							token
						}
					}
				`,
			});

			localStorage.setItem('token', data.signup.token);
			router.push('/').then(() => window.location.reload());
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div>
			<input
				type="text"
				name="name"
				value={user.name}
				onChange={handleChange}
				placeholder="Name"
			/>
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
			<button onClick={handleSignUp}>Sign Up</button>
		</div>
	);
};

export default Signup;