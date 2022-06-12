import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { baseAPI } from "../constants/Constant";

const OnlineUser = ({ currentUser, setCurrentChat, onlineUsers }) => {
  //states for friends of user
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  //getting user friendsList
  useEffect(() => {
    const getFriends = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const friendsRes = await axios.get(
          `${baseAPI}/user/${currentUser}/followings`
        );
        setFriends(friendsRes.data.friends);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [currentUser]);

  //filtering online friends
  useEffect(() => {
    if (!onlineUsers) {
      return;
    }
    setOnlineFriends(
      friends.filter((friend) => onlineUsers.includes(friend._id))
    );
  }, [friends, onlineUsers]);

  //handle the conversation of an online user
  const handleConversation = async (user) => {
    try {
      const convRes = await axios.get(
        `${baseAPI}/conversations/${user._id}/${currentUser}`
      );
      setCurrentChat(convRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {onlineFriends?.map((onlineFriend) => (
        <div
          key={onlineFriend._id}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => handleConversation(onlineFriend)}
        >
          <div className="relative ">
            <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
              <Image
                src={
                  onlineFriend?.profilePicture
                    ? onlineFriend?.profilePicture
                    : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                }
                alt="logo"
                layout="fill"
                className="rounded-full cursor-pointer"
              />
            </div>

            <p className="bg-sm1 h-5 w-5 flex items-center justify-center rounded-full absolute -top-1 left-6 cursor-pointer z-60">
              <BsCircleFill className="w-4 h-4 text-green-700" />
            </p>
          </div>
          <p className="font-libre text-sm1 text-base md:text-xl tracking-widest font-semibold capitalize">
            {onlineFriend.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OnlineUser;
