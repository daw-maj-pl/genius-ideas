import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import Message from '../components/Message';

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState('');
  const [allMessage, setAllMessages] = useState([]);

  //Submit a message
  const submitMessage = async () => {
    //Check if the user is logged
    if (!auth.currentUser) return router.push('/auth/login');

    if (!message) {
      toast.error("Don't leave an empty message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      });
      return;
    }
    const postRef = doc(db, 'posts', routeData.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now()
      })
    });

    setMessage('');
  };

  //Get Comments
  const getComments = () => {
    const postRef = doc(db, 'posts', routeData.id);
    const unsubscribe = onSnapshot(postRef, doc => {
      setAllMessages(doc.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    // if (!router.isReady) return;
    // return getComments();
    if (router.isReady) return getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={e => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message"
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessage
            ?.sort((a, b) => b.time.seconds - a.time.seconds)
            .map(message => (
              <div
                className="bg-white p-4 my-4 border-2"
                key={message.time.seconds}
              >
                <div className="flex items-center gap-2 mb-4">
                  <img
                    className="w-10 rounded-full"
                    src={message.avatar}
                    alt=""
                  />
                  <h2>{message.userName}</h2>
                </div>
                <h2>{message.message}</h2>
                <h6 className="text-xs text-slate-400 mt-2">
                  {new Date(message.time.seconds * 1000).toLocaleString()}
                </h6>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
