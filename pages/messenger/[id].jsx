import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import Layout from "../../components/messengerLayout/Layout";
import { MdSend } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { BiConversation } from "react-icons/bi";
import OnlineUser from "../../components/onlineUsers/OnlineUser";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { baseAPI } from "../../components/constants/Constant";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { setUsersOnline } from "../../redux/features/authSlice";
import Head from "next/head";
import OnlineFriends from "../../components/OnlineFriends";
import { MdClose } from "react-icons/md";
import { setConversations } from "../../redux/features/authSlice";

// const socket = io("http://localhost:9001", {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
// });

// https://milessocial-media-backend.herokuapp.com

const Messenger = ({ conversations }) => {
  // getting the logged in user from redux using useSelector hook
  const { user } = useSelector((state) => ({ ...state.auth }));
  const currentUser = user?.user;

  //showing chat side bar on mobile view
  const [onlineOpen, setOnlineOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);

  //pushing the conversations to redux
  useEffect(() => {
    if (conversations) {
      dispatch(setConversations(conversations));
    }
  }, [conversations, dispatch]);

  //handleOlineOpen
  const handleOnlineOpen = (e) => {
    e.preventDefault();
    setOnlineOpen(!onlineOpen);
    setConversationOpen(false);
  };

  //handleConversationOpen
  const handleConversationOpen = (e) => {
    e.preventDefault();
    setConversationOpen(!conversationOpen);
    setOnlineOpen(false);
  };

  //ref
  const msgRef = useRef("");
  const scrollRef = useRef();
  const socket = useRef();

  // router
  const router = useRouter();
  //dispatch
  const dispatch = useDispatch();

  //states for messages
  const [currentChat, setCurrentChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivingMessage, setArrivingMessage] = useState(null);
  //online users state
  const [onlineUsers, setOnlineUsers] = useState([]);

  //running socket once
  //getting the sent message the client sent to server
  useEffect(() => {
    socket.current = io("https://milessocial-media-backend.herokuapp.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.current.on("received_message", (data) => {
      console.log("data => ", data);
      setArrivingMessage({
        sender: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      });
    });
  }, []);

  //checking for arriving messages
  useEffect(() => {
    arrivingMessage &&
      currentChat?.members.includes(arrivingMessage.sender) &&
      setMessages((prevMessage) => [...prevMessage, arrivingMessage]);
  }, [arrivingMessage, currentChat]);

  //socket io methods here
  useEffect(() => {
    socket.current.emit("add_user", currentUser?._id);
    socket.current.on("online_users", (users) => {
      setOnlineUsers(
        currentUser?.followings.filter((following) =>
          users.some((user) => user.userId === following)
        )
      );
    });
  }, [currentUser]);

  //dispatching the online users
  useEffect(() => {
    dispatch(setUsersOnline(onlineUsers));
  }, [currentUser, onlineUsers, dispatch]);

  //getting the user messages using he useEffect hook
  useEffect(() => {
    const getMessages = async () => {
      try {
        const messageRes = await axios.get(
          `${baseAPI}/messages/${currentChat?._id}`
        );
        setMessages(messageRes?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  //send message
  const sendMessage = async (e) => {
    e.preventDefault();
    const msg = msgRef?.current?.value;
    if (msg === "") {
      return;
    }

    const newMsg = {
      conversationId: currentChat?._id,
      sender: currentUser?._id,
      message: msg,
    };

    //getting receivers id
    const receiverId = currentChat?.members?.find(
      (member) => member !== currentUser?._id
    );

    //socket method to send message to socket server
    socket.current.emit("send_message", {
      senderId: currentUser?._id,
      receiverId,
      message: msg,
    });

    try {
      const messageRes = await axios.post(`${baseAPI}/newmessage`, newMsg);
      setMessages([...messages, messageRes?.data]);
      msgRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  //handling the scroll to view event
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // locking out anyone not logged in
  if (!user) {
    router.push("/login");
  }

  return (
    <div>
      <Head>
        <title>SM-messenger</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-[calc(100vh-85px)]">
        <div className="w-[20%] hidden lg:inline-flex bg-gradient-to-br from-sm7 via-sm5 to-sm7">
          <div className="h-full p-2">
            <input
              type="text"
              placeholder="Search"
              className="outline-none pt-3 w-full px-2 text-lg font-libre tracking-wider text-sm1 bg-transparent border-b border-sm6 placeholder:text-white"
            />
            <div className="space-y-4 mt-3">
              {conversations?.map((conversation) => (
                <div
                  key={conversation?._id}
                  onClick={() => setCurrentChat(conversation)}
                >
                  <Conversation
                    conversation={conversation}
                    currentUser={currentUser}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[60%] bg-gradient-to-l from-sm5 via-sm6 to-sm5 ">
          {currentChat ? (
            <div className="h-full p-2 flex flex-col">
              <div className="space-y-3 overflow-y-auto px-2 lg:px-0 pt-3 pb-4 h-full">
                {messages?.map((message) => (
                  <div key={message?._id} ref={scrollRef}>
                    <Message
                      own={message?.sender === currentUser?._id}
                      message={message}
                      currentUser={currentUser}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-3 space-x-3">
                <textarea
                  ref={msgRef}
                  placeholder="...message here"
                  row="auto"
                  className="w-[95%] rounded-xl px-3 py-1 outline-none bg-sm6 text-sm1 font-libre tracking-wider text-lg"
                />
                <button
                  className="bg-sm2 w-10 h-10 rounded-full justify-center items-center flex sticky bottom-0 cursor-pointer"
                  onClick={sendMessage}
                >
                  <MdSend className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mt-20 cursor-default">
              <p className="text-sm1 text-2xl font-libre font-semibold tracking-wider capitalize">
                No chats to display, start a conversation!!!
              </p>
            </div>
          )}
        </div>
        <div className="hidden lg:inline-flex w-[20%] bg-gradient-to-bl from-sm7 via-sm5 to-sm7">
          <div className="h-full p-2">
            {onlineUsers?.length === 0 ? (
              <p className="text-lg font-libre text-sm1 tracking-wider font-semibold">
                No Friends Online
              </p>
            ) : (
              <div className="space-y-3 pt-3">
                <OnlineUser
                  currentUser={currentUser?._id}
                  setCurrentChat={setCurrentChat}
                  onlineUsers={onlineUsers}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* online friends sidebar */}
      {user && (
        <div
          className="fixed top-60 right-2 z-70 bg-sm6 p-2 rounded-full animate-slowpulse lg:hidden"
          onClick={handleOnlineOpen}
        >
          <BsFillChatDotsFill className="w-10 h-10 text-sm2" />
        </div>
      )}

      <div className="lg:hidden">
        <OnlineFriends
          onlineOpen={onlineOpen}
          setOnlineOpen={setOnlineOpen}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
        />
      </div>
      {/* conversation list side bar */}
      {user && (
        <div
          className="fixed top-12 left-2 z-70 bg-sm6 p-2 rounded-full animate-slowpulse lg:hidden"
          onClick={handleConversationOpen}
        >
          <BiConversation className="w-10 h-10 text-sm2" />
        </div>
      )}

      <div className="">
        <div
          className={
            conversationOpen
              ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-700"
              : "lg:hidden fixed -left-[100%] top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-900"
          }
        >
          <div
            className={
              conversationOpen
                ? "fixed top-0 left-0 h-screen bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%]  md:w-[55%] ease-in duration-900 z-80 pt-3 px-3"
                : "fixed -left-[100%] top-0 ease-in duration-700 bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%] md:w-[55%] h-screen z-80 pt-3 px-3"
            }
          >
            <div className="flex justify-end">
              <div
                onClick={() => setConversationOpen(!conversationOpen)}
                className="flex items-center justify-center bg-sm7 rounded-full w-7 h-7"
              >
                <MdClose className="w-5 h-5 text-sm1" />
              </div>
            </div>
            <p className="font-rancho text-lg md:text-xl text-sm1 font-semibold tracking-widest bg-sm4 px-2 py-1 rounded-md mt-1 mb-2 w-[80%]">
              Online Friends
            </p>
            {conversations.length !== 0 ? (
              <div className="space-y-4">
                {conversations?.map((conversation) => (
                  <div
                    key={conversation?._id}
                    onClick={() => {
                      setCurrentChat(conversation);
                      setConversationOpen(!conversationOpen);
                    }}
                  >
                    <Conversation
                      conversation={conversation}
                      currentUser={currentUser}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm1 text-2xl font-libre font-semibold tracking-wider mt-5">
                  No conversations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Messenger.Layout = Layout;

export default Messenger;

//server side fetching messages
export async function getServerSideProps(context) {
  const { id } = context?.query;

  const conversationRes = await fetch(`${baseAPI}/conversations/${id}`);
  const conversations = await conversationRes?.json();

  return {
    props: {
      conversations,
    },
  };
}
