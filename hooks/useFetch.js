import { useEffect, useState } from 'react';
import { client } from '../apollo-client';
import { gql } from '@apollo/client';

export const useFetch = (page, setPosts) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setLoading(true);
		client
			.query({
				query: gql`
					query {
						feed(take: 10, skip: ${(page - 1) * 10}) {
							count
							links {
								id
								description
								url
								postedBy {
									id
									name
								}
								votes {
									id
									user {
										id
										name
									}
								}
							}
						}
					}
				`
			})
			.then(res => setPosts(posts => [...posts, ...res.data.feed.links]))
			.catch(err => setError(err.message))
			.finally(() => setLoading(false));
	}, [page]);

	return { loading, error };
};