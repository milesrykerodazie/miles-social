import { MdDynamicFeed, MdVideoLabel, MdGroup, MdSchool } from "react-icons/md";
import { AiFillWechat, AiFillBook } from "react-icons/ai";
import {
  BsFillQuestionSquareFill,
  BsFillHandbagFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import userPic from "../public/assets/profilePic.jpg";
import Image from "next/image";
import { Users } from "../public/assets/dummyData";
import { useSelector } from "react-redux";
import { baseAPI } from "./constants/Constant";
import { useEffect, useState } from "react";
import axios from "axios";

const LeftSide = () => {
  //getting the user from redux using use selector
  const { user } = useSelector((state) => ({ ...state.auth }));
  const userId = user?.user._id;

  const [userFriends, setUserFriends] = useState([]);

  //getting friends of user
  useEffect(() => {
    if (!userId) {
      return;
    }
    const getFriends = async () => {
      try {
        const friendsRes = await axios.get(
          `${baseAPI}/user/${userId}/followings`
        );
        setUserFriends(friendsRes?.data?.friends);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [userId]);
  return (
    <div className="sticky top-[80px] px-2 bg-sm2 rounded-b-md pt-5 pb-3 h-[calc(100vh-100px)]  ">
      {/* the side bar tools */}
      <div className="desktop:space-y-5 space-y-3">
        <div className="flex items-center space-x-2 cursor-pointer">
          <MdDynamicFeed className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Feed
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <AiFillWechat className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Chats
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <MdVideoLabel className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Videos
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <MdGroup className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Groups
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <AiFillBook className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Bookmarks
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <BsFillQuestionSquareFill className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Questions
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <BsFillHandbagFill className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Jobs
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <BsFillCalendarEventFill className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Event
          </p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <MdSchool className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" />
          <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7">
            Courses
          </p>
        </div>
        <button className="bg-white text-sm7 px-2 2xl:px-7 2xl:py-2 text-sm 2xl:text-lg font-rancho tracking-wider rounded-sm 2xl:rounded-md">
          Show More
        </button>
      </div>
      <hr className="my-3 xl:my-5 border-sm7" />

      {/* the friends list for all screens*/}
      <h4 className="bg-sm7 text-sm1 font-rancho tracking-widest text-sm 2xl:text-xl p-1 rounded-t-md relative">
        Friends List
      </h4>
      <div className="space-y-3 h-[27%] monitor:h-[35%] overflow-y-auto desktop:pt-5 pt-2">
        {userFriends.map((userFriend) => (
          <div key={userFriend._id} className="flex items-center space-x-2 ">
            <div className="relative w-6 h-6 2xl:w-10 2xl:h-10">
              <Image
                src={
                  userFriend?.profilePicture
                    ? userFriend?.profilePicture
                    : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                }
                alt="logo"
                layout="fill"
                className="rounded-full cursor-pointer"
              />
            </div>
            <p className="cursor-pointer text-sm 2xl:text-lg font-rancho text-sm7 tracking-wider capitalize">
              {userFriend?.firstName + " " + userFriend?.lastName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSide;
