import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaArrowDown } from 'react-icons/fa6'
import './App.css'
import { getAuth, signInWithPopup, GoogleAuthProvider, getDocs, onAuthStateChanged, signOut, db, collection, addDoc  } from "./Firebase";
import Message from './assets/components/message'
const auth = getAuth();

const App = () => {
  const [messaging, setmessaging] = useState([])
  const [logoutbtn, setlogoutbtn] = useState(false)
  const [chatpage, setchatpage] = useState(true)
  const [message, setmessage] = useState('')

  let pageoffhandler = () => {
    signouthandler();
    setchatpage(true)
    setlogoutbtn(!logoutbtn)  
  }

  let provider = () => {
    const google = new GoogleAuthProvider();
    // let google = GoogleAuthProvider()
signInWithPopup(auth, google)
.then((result) => {
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  const user = result.user;
  console.log(user);
  setchatpage(false)

}).catch((error) => {

  const errorMessage = error.message;
  console.log('Error:' + errorMessage);
});
  }
  let signouthandler = () => {
    const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
  console.log(error);
  
});
  }
  let submithandler = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        first: message,
        last: "Lovelace",
        born: 1815
      });
      messaging.push(message)
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      // console.error("Error adding document: ", e);
    }
    setmessage('')
    
  }
  useEffect(() => {
    let datahandler = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
querySnapshot.forEach((doc) => {
  // console.log(`${doc.id} => ${doc.data()}`);
  // console.log(doc.data().first);
  messaging.push(doc.data().first)
// console.log(messaging);

  
});
}
return datahandler;
}, [messaging])
let chat_data = messaging.map((chat) => {
   return (
     <Message text={chat} user='me'/>
   )
})
useEffect(() => {
  const subscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
    
      const uid = user.uid;
      console.log(user);
      setchatpage(false)
      
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  return subscribe 
}, [])
  return (
    <div className='home'>
      { chatpage ?
      <div className="login flex flex-col gap-5 items-center justify-center w-full h-screen bg-gray-200">
      <h1 className='text-7xl font-bold'>Chat <span className='text-green-800'>.pk</span></h1>
      <p>Chat world wide and make friends online.</p>
      <FaArrowDown className='text-4xl text-gray-800 mt-10 mb-5'/>
      <button onClick={provider} className='flex items-center p-1 px-5 bg-white rounded hover:shadow-xl'> <img className='w-10' src="./public/G.png" alt="" />Continue with Google</button>
      </div>:
      <div className='chat w-full h-screen bg-slate-300 flex justify-center items-center'>
      <div className="box w-[480px] rounded p-4 h-[90vh] bg-white relative">
        <div className="chat-head flex mb-2 items-center justify-between">
        <h2 className='text-3xl text-center font-bold'>Chat <span className='text-green-800'>.pk</span></h2>
        <BsThreeDotsVertical onClick={() => setlogoutbtn(!logoutbtn)} className='cursor-pointer'/>
        {logoutbtn ? <button onClick={pageoffhandler} className='absolute top-12 right-10 bg-gray-300 py-1 rounded px-2'>Logout</button> : ''}
        </div>

        <div className="chats flex flex-col h-[77vh] justify-end overflow-y-auto">
          <div className="chatting overflow-y-auto">
            {chat_data}
          </div>
              <div className="chat-area w-full mt-2 bottom-4">
          <input value={message} onChange={(e) => setmessage(e.target.value)} className='border  py-1 w-[75%] rounded px-2' type="text" placeholder='Enter Message to send...' />
          <button onClick={submithandler} className='text-white rounded bg-blue-600 mx-2 py-1 px-5'>Send</button>
        </div>     
        </div>
        
      </div>
    </div>
    }
    </div>
    
  )
}

export default App