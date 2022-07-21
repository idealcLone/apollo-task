import classes from '../styles/Home.module.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post } from '../components/Post';
import { useFetch } from '../hooks/useFetch';
import { client } from '../apollo-client';
import { gql } from '@apollo/client';

export default function Home() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  const [creationResponse, setCreationResponse] = useState('');
  const [newPost, setNewPost] = useState({
    link: '',
    description: '',
  })

  useFetch(page, setPosts);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || ['null', 'undefined'].includes(token)) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1);
        observer.unobserve(entries[0].target);
      }
    }, {
      threshold: 1
    });

    const lastPost = document.querySelector('.post:last-child');
    lastPost && observer.observe(lastPost);
  }, [posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await client.mutate({
        mutation: gql`
        mutation {
          post(
            url: "${newPost.link}",
            description: "${newPost.description}"
          ) {
            id
          }
        }
      `,
      });
      setNewPost({
        link: '',
        description: ''
      });
      setCreationResponse('Success!');
    } catch (err) {
      setCreationResponse(err.message);
    }

    setTimeout(() => {
      setCreationResponse('');
    }, 5000);
  }

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;

    setNewPost({
      ...newPost,
      [name]: value
    });
  }

  return (
    <main className={classes['home']}>
      <form className={classes['create-post']}>
        <input
          name="link"
          type="text"
          value={newPost.link}
          onChange={handleNewPostChange}
        />
        <textarea
          name="description"
          value={newPost.description}
          onChange={handleNewPostChange}
        />
        <button onClick={handleSubmit}>Create new post</button>
      </form>
      {creationResponse && <p className={classes['response']}>{creationResponse}</p>}
      <ul className={classes['posts']}>
        {posts.map(post => <Post post={post} key={post.id} />)}
      </ul>
    </main>
  )
}
