import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import './LeftSidebar.css'
import { useNavigate } from 'react-router-dom'
import { db, logout } from '../../config/firebase'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const LeftSidebar = () => {
  
  const navigate = useNavigate();

  const {userData, chatData, chatUser,
     messagesId, setChatUser, setMessagesId} = useContext(AppContext)
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false)
  // console.log("chatData is : " ,chatData);

  const inputHandler = async (e) =>{
    try {
      const input = e.target.value;
      if(input){
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExitst = false;
          chatData?.map(user => {
            console.log(user.rId , querySnap.docs[0].data().id)
            if(user.rId === querySnap.docs[0].data().id)
            userExitst = true;
          })
          if(!userExitst)
          setUser(querySnap.docs[0].data());
        }
        else{
          setUser(null);
        }
      }
      else{
        setShowSearch(false);
      }
      
    } catch (error) {
      console.log("error in inputHandler : ",error);
    }
  }

  const addChat = async() =>{
    const messagesRef = collection(db, 'messages');
    const chatsRef = collection(db, 'chats');
    try {
      const newMessagesRef = doc(messagesRef);

      await setDoc(newMessagesRef, {
        createAt: serverTimestamp(),
        messages:[]
      })

      await updateDoc(doc(chatsRef, user.id),{
        chatsData:arrayUnion({
          messageId:newMessagesRef.id,
          lastMessage:"",
          rId:userData.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })

      await updateDoc(doc(chatsRef, userData.id),{
        chatsData:arrayUnion({
          messageId:newMessagesRef.id,
          lastMessage:"",
          rId:user.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })

      const uSnap = await getDoc(doc(db, 'users', user.id));
      const uData = uSnap.data();
      setChat({
        messagesId: newMessagesRef.id,
        lastMessage:"",
        rId: user.id,
        updateAt: Date.now(),
        messageSeen:true,
        userData:uData
      })

    } catch (error) {
      toast.error(error.message);
      console.log("error in LeftSidebar addChat : " , error)
    }
  }

  const setChat = async(item) =>{
    console.log("setChat is called");
    try {
      setMessagesId(item.messageId);
      setChatUser(item)
      const userChatsRef = doc(db, "chats" , userData.id);
      // console.log("userChatRef ",userChatsRef)
      const userChatsSnapshot = await getDoc(userChatsRef);
      // console.log("userChatsSnapshot : ",userChatsSnapshot.data());
      const userChatsData = userChatsSnapshot.data();
      // console.log("userChatsData : ",userChatsData)
      const chatIndex = userChatsData.chatsData.findIndex((c) =>c.messageId === item.messageId);
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatsData:userChatsData.chatsData
      })
    } catch (error) {
      toast(error.message);
      console.log(error);
    }
    
  }

  useEffect(() =>{
    const updateChatUserData = async () =>{
      if(chatUser){
        const userRef = doc(db, 'users', chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev => ({...prev, userData:userData}))
      }
    }

    updateChatUserData()
  }, [chatData])

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={()=>navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler}  type="text" placeholder='Search here...'/>
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user
        ? <div onClick={addChat} className='friends add-user'>
          <img src={user.avatar} alt="" />
          <p>{user.name}</p>
        </div>
        :
        chatData?.map((item, index) =>(
          <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
            <img src={item.userData.avatar} alt="" />
            <div>
              <p>{item.userData.name}</p>
              <span>{item.lastMessage}</span>
            </div>
          </div>
        ))
        }
        
        
      </div>
    </div>
  )
}

export default LeftSidebar