import { MdClose } from "react-icons/md";

import { BsCircleFill } from "react-icons/bs";

import { Users } from "../public/assets/dummyData";
import Image from "next/image";
import userPic from "../public/assets/profilePic.jpg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseAPI } from "./constants/Constant";

const OnlineFriends = ({
  onlineOpen,
  setOnlineOpen,
  currentUser,
  setCurrentChat,
}) => {
  // getting online users
  const usersOnline = useSelector((state) => state.auth.usersOnline);
  //states for friends of user
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  //getting user friendsList
  useEffect(() => {
    const getFriends = async () => {
      if (!currentUser?._id) {
        return;
      }
      try {
        const friendsRes = await axios.get(
          `${baseAPI}/user/${currentUser?._id}/followings`
        );
        setFriends(friendsRes.data.friends);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [currentUser?._id]);

  //filtering online friends
  useEffect(() => {
    if (!usersOnline) {
      return;
    }
    setOnlineFriends(
      friends.filter((friend) => usersOnline.includes(friend._id))
    );
  }, [friends, usersOnline]);

  //handle the conversation of an online user
  const handleConversation = async (user) => {
    try {
      const convRes = await axios.get(
        `${baseAPI}/conversations/${user._id}/${currentUser?._id}`
      );
      setCurrentChat(convRes.data);
      setOnlineOpen(!onlineOpen);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={
        onlineOpen
          ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-700"
          : "lg:hidden fixed -left-[100%] top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-900"
      }
    >
      <div
        className={
          onlineOpen
            ? "fixed top-0 left-0 h-screen bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%]  md:w-[55%] ease-in duration-900 z-80 pt-3 px-3"
            : "fixed -left-[100%] top-0 ease-in duration-700 bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%] md:w-[55%] h-screen z-80 pt-3 px-3"
        }
      >
        <div className="flex justify-end">
          <div
            onClick={() => setOnlineOpen(!onlineOpen)}
            className="flex items-center justify-center bg-sm7 rounded-full w-7 h-7"
          >
            <MdClose className="w-5 h-5 text-sm1" />
          </div>
        </div>

        {/* online friends */}
        <p className="font-rancho text-lg md:text-xl text-sm1 font-semibold tracking-widest bg-sm4 px-2 py-1 rounded-md mt-1 mb-2 w-[80%]">
          Online Friends
        </p>
        {onlineFriends.length !== 0 ? (
          <div className="space-y-4 md:space-y-5  h-[90%] overflow-y-auto desktop:pt-5 pt-3">
            {onlineFriends?.map((onlineFriend) => (
              <div
                key={onlineFriend._id}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => handleConversation(onlineFriend)}
              >
                <div className="relative w-10 h-10">
                  <div>
                    <Image
                      priority
                      src={
                        onlineFriend?.profilePicture
                          ? onlineFriend?.profilePicture
                          : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                      }
                      alt="userPic"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="bg-sm1 h-5 w-5 flex items-center justify-center rounded-full absolute -top-1 left-6">
                    <BsCircleFill className="w-4 h-4 text-green-700" />
                  </p>
                </div>
                <p className="font-rancho text-sm1 text-base md:text-xl tracking-widest font-semibold capitalize">
                  {onlineFriend?.username}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm1 text-2xl font-libre font-semibold tracking-wider mt-5">
              No online friends.
            </p>
          </div>
        )}

        {/* end of online friends*/}
      </div>
    </div>
  );
};

export default OnlineFriends;
