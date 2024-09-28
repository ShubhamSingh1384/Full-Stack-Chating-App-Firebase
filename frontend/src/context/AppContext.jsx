import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({children}) =>{

    const navigate = useNavigate()

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const[chatUser, setChatUser] = useState(null);
    

    const loadUserData = async(uid) =>{
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            // console.log(userSnap.data());
            // console.log(userData);
            console.log(userData.avatar, userData.name);
            if(userData.avatar && userData.name){
                navigate('/chat')
            }
            else{
                navigate('/profile')
            }

            await updateDoc(userRef, {
                lastSeen:Date.now()
            })
            // console.log(auth.chatUser)
            setInterval(async () =>{
                if(auth.chatUser){
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    })
                }
            }, 60000)

        } catch (error) {
            console.log("error in AppContext : ", error);
        }
    }

    useEffect(() =>{
        if(userData){
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async(res) =>{
                const chatItems = res.data().chatsData;
                const tempData = [];
                console.log("chatItems : ", res.data());
                for(const item of chatItems){
                    console.log("item is " , item);
                    const userRef = doc(db, 'users', item.rId)
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({...item, userData})
                }
                setChatData(tempData.sort((a,b) => b.updateAt - a.updatedAt));
                // console.log(tempData.sort((a,b) => b.updateAt - a.updatedAt));
                // console.log(chatData);
            })
            return () =>{
                unSub();
            }
        }
    }, [userData])

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser,
        messages,
        setMessages

    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider