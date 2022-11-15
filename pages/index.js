import { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Message from '../components/Message';

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
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
          <Message key={post.id} {...post}></Message>
        ))}
      </div>
    </div>
  );
}
