import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { baseAPI } from "../constants/Constant";

const Message = ({ own, message, currentUser }) => {
  //states
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [otherUserDetails, setOtherUserDetails] = useState({});

  //getting the users details
  useEffect(() => {
    const getusers = async () => {
      try {
        if (message?.sender === currentUser?._id) {
          const currentRes = await axios.get(
            `${baseAPI}/user/${currentUser?._id}`
          );
          setCurrentUserDetails(currentRes?.data.user);
        } else {
          const otherRes = await axios.get(
            `${baseAPI}/user/${message?.sender}`
          );
          setOtherUserDetails(otherRes?.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getusers();
  }, [message, currentUser]);

  return (
    <div className="">
      <div className={own ? "flex space-x-3 justify-end" : "flex space-x-3"}>
        {own ? (
          <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
            <Image
              src={
                currentUserDetails?.profilePicture
                  ? currentUserDetails?.profilePicture
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="logo"
              layout="fill"
              className="rounded-full cursor-pointer"
            />
          </div>
        ) : (
          <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
            <Image
              src={
                otherUserDetails?.profilePicture
                  ? otherUserDetails?.profilePicture
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="logo"
              layout="fill"
              className="rounded-full cursor-pointer"
            />
          </div>
        )}
        <p
          className={
            own
              ? "bg-gradient-to-r from-sm1 via-sm3 to-sm1 max-w-[40%] rounded-sm md:rounded-lg px-2 py-1 md:p-2 font-libre text-lg text-sm7 mt-3 leading-tight"
              : "bg-gradient-to-r from-sm7 via-sm5 to-sm7 max-w-[40%] rounded-sm md:rounded-lg px-2 py-1 md:p-2 font-libre text-lg text-sm1 mt-3 leading-tight"
          }
        >
          {message?.message}
        </p>
      </div>
      <p
        className={
          own
            ? "font-libre text-base text-sm2 flex justify-end space-x-2"
            : "font-libre text-base text-sm2 flex space-x-2"
        }
      >
        <span>{format(message?.createdAt)}</span>
        <span className="hidden md:inline-flex">
          ({moment(message?.createdAt).format("lll")})
        </span>
      </p>
    </div>
  );
};

export default Message;
