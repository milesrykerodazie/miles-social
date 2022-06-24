import Image from "next/image";
import userPic from "../public/assets/profilePic.jpg";
import { BsCircleFill } from "react-icons/bs";
import { Users } from "../public/assets/dummyData";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { baseAPI } from "./constants/Constant";
import axios from "axios";

const RightSide = () => {
  //  getting the online user details
  const { user } = useSelector((state) => ({ ...state.auth }));
  const currentUser = user?.user;

  const socket = useRef();

  //online users state
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  //running socket once
  //getting the sent message the client sent to server
  useEffect(() => {
    socket.current = io("https://milessocial-media-backend.herokuapp.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }, []);

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

  //getting user friendsList
  useEffect(() => {
    const getFriends = async () => {
      if (!currentUser) {
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

  return (
    <div className=" bg-sm2 rounded-b-md px-2 pt-5 pb-3 space-y-5 h-[calc(100vh-100px)] sticky top-[80px] hidden lg:inline-block lg:w-[30%]">
      {/* events */}
      <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
          <Image
            priority
            src={userPic}
            alt="logo"
            layout="fill"
            className="rounded-md object-cover"
          />
        </div>
        <p className="font-rancho text-base 2xl:text-xl tracking-wider text-sm7">
          <b>Miles Ryker</b> and <b>7 others</b> have events today.
        </p>
      </div>
      {/* ads */}
      <div className="relative">
        <div className="relative w-full h-36 2xl:h-44">
          <Image
            priority
            src={userPic}
            alt="logo"
            layout="fill"
            className="rounded-md object-cover"
          />
        </div>

        <p className="font-rancho text-sm 2xl:text-xl text-sm7 tracking-wider bg-sm4 w-1/3 px-2 py-1 text-center absolute top-0 rounded-tl-md rounded-br-md">
          Ads Here
        </p>
      </div>
      {/* online friends */}
      <p className="font-rancho text-base 2xl:text-xl text-sm1 tracking-widest bg-sm7 px-2 py-1 rounded-md">
        Online Friends
      </p>
      <div className="space-y-3 h-[50%] lg:h-[45%] 2xl:h-[55%] laptop:h-[45%] monitor:h-[52%] overflow-y-auto desktop:pt-5 pt-2">
        {onlineFriends.map((onlineFriend) => (
          <div key={onlineFriend._id} className="flex items-center space-x-4 ">
            <div className="relative">
              <div className="relative w-6 h-6 2xl:w-10 2xl:h-10">
                <Image
                  src={
                    onlineFriend?.profilePicture
                      ? onlineFriend?.profilePicture
                      : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                  }
                  alt="logo"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <p className="bg-sm1 h-3 w-3 2xl:h-5 2xl:w-5 flex items-center justify-center rounded-full absolute -top-1 2xl:left-6 left-3 ">
                <BsCircleFill className="w-2 h-2 2xl:w-4 2xl:h-4 text-green-700" />
              </p>
            </div>
            <p className="font-rancho text-sm7 text-sm 2xl:text-lg tracking-wider capitalize">
              {onlineFriend?.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSide;
