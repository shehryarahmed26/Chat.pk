import React, { useEffect, useState, useRef } from 'react';
import Avatar from 'react-avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowDown } from 'react-icons/fa6';
import './App.css';
import { getAuth, signInWithPopup, serverTimestamp, query, orderBy, onSnapshot, GoogleAuthProvider, signOut, onAuthStateChanged, collection, addDoc, db } from './Firebase';
import Message from './assets/components/Message';

const auth = getAuth();

const App = () => {
  const q = query(collection(db, 'messages'), orderBy('createadat', 'asc'));
  const [messaging, setMessaging] = useState([]);
  const [logoutbtn, setLogoutBtn] = useState(false);
  const [chatpage, setChatPage] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  

  // Ref for chat container
  const chatContainerRef = useRef(null);

  let pageoffhandler = () => {
    signouthandler();
    setChatPage(true);
    setLogoutBtn(!logoutbtn);
  };

  let provider = () => {
    const google = new GoogleAuthProvider();
    signInWithPopup(auth, google)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setChatPage(false);
      })
      .catch((error) => {
        console.log('Error:' + error.message);
      });
  };

  let signouthandler = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let 
  
  submithandler = async () => {
    if (message === '') {
      alert('Please Write Something');
    } else {
      try {
        await addDoc(collection(db, 'messages'), {
          text: message,
          uid: user.uid,
          createadat: serverTimestamp(),
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    }
    setMessage('');
  };

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messaging]);

  // Fetch messages in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snap) => {
      setMessaging(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  let chat_data = messaging.map((chat, i) => {
    return <Message key={i} text={chat.text} user={chat.uid === user.uid ? 'me' : 'other'} />;
  });

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setChatPage(false);
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home">
      {chatpage ? (
        <div className="login flex flex-col gap-5 items-center justify-center w-full h-screen bg-gray-200">
          <h1 className="text-7xl font-bold">
            Chat <span className="text-green-800">.pk</span>
          </h1>
          <p>Chat world wide and make friends online.</p>
          <FaArrowDown className="text-4xl text-gray-800 mt-10 mb-5" />
          <button onClick={provider} className="flex items-center p-1 px-5 bg-white rounded hover:shadow-xl">
            <img className="w-10" src="/Images/G.png" alt="" />
            Continue with Google
          </button>
        </div>
      ) : (
        <div className="chat w-full h-screen bg-slate-300 flex justify-center items-center">
          <div className="box w-[480px] rounded p-4 h-[90vh] bg-white relative">
            <div className="chat-head flex mb-2 items-center justify-between">
              <h2 className="text-3xl text-center font-bold my-2">
                Chat <span className="text-green-800">.pk</span>
              </h2>
              <h4 className='absolute text-gray-700 text-xs -bottom-6 left-4 text-center'>Copyright © 2024 Chat.pk  All Rights Reserved | Made By Shehryar Ahmed</h4>

              <BsThreeDotsVertical onClick={() => setLogoutBtn(!logoutbtn)} className="cursor-pointer" />
              {logoutbtn ? (
                <button onClick={pageoffhandler} className="absolute top-12 right-10 bg-gray-300 py-1 rounded px-2">
                  Logout
                </button>
              ) : (
                ''
              )}
            </div>

            <div className="chats flex flex-col h-[77vh] justify-end overflow-y-auto">
              <div className="chatting overflow-y-auto" ref={chatContainerRef}>{chat_data} </div>
              
              <div className="chat-area w-full my-2 bottom-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border py-1 w-[70%] rounded px-2"
                  type="text"
                  placeholder="Enter Message to send..."
                />
                <button onClick={submithandler} className="text-white rounded bg-blue-600 mx-2 py-1 px-5">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
