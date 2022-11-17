import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Message from '../components/Message';

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    return getPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>Genius Ideas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-12 text-lg font-medium">
        <h2>See other people ideas</h2>
        {allPosts.map(post => (
          <Message key={post.id} {...post}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button>
                {/* {post.comments?.length > 0 ? post.comments?.length : 0} comments */}
                {post.comments?.length || 0} comments
              </button>
            </Link>
          </Message>
        ))}
      </div>
    </div>
  );
}
