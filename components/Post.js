import classes from './Post.module.scss';
import classNames from 'classnames';

import UpvoteIcon from '../assets/icons/upvote-svgrepo-com.svg';
import Image from 'next/image';
import { client } from '../apollo-client';
import { gql } from '@apollo/client';

export const Post = ({ post }) => {
	const handleUpvote = () => {
		client
			.mutate({
				mutation: gql`
					mutation {
						vote(linkId: "${post.id}") {
							id
						}
					}
				`,
			})
			.then(() => alert('Upvoted!'))
			.catch(() => alert('You already voted!'))
	};

	return (
		<li className={classNames('post', classes['post'])}>
			<p className={classes['post__description']}>{post.description}</p>
			<div className={classes['post__footer']}>
				<button className={classes['post__upvote']} onClick={handleUpvote}>
					<Image src={UpvoteIcon} alt="Upvote Icon" className={classes['post__icon']}/>
				</button>
				<ul className={classes['post__votes']}>
					{post.votes.map((vote, index) =>
						index < 3 && <li key={vote.id}>{vote.user.name.toUpperCase()[0]}</li>
					)}
					{post.votes.length > 3 && <div>... {post.votes.length - 3} more upvotes</div>}
				</ul>
			</div>
		</li>
	);
};