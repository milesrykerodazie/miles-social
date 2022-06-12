import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userpic from "../../public/assets/profilePic.jpg";
import { baseAPI } from "../constants/Constant";

const Conversation = ({ conversation, currentUser }) => {
  // getting out the other user in the conversation, we use the useEffect and useState to handle it
  const [otherUser, setOtherUser] = useState(null);

  // useEffect to get the other user
  useEffect(() => {
    const otherUserId = conversation?.members.find(
      (member) => member !== currentUser._id
    );
    const getOtherUser = async () => {
      try {
        const res = await axios.get(`${baseAPI}/user/${otherUserId}`);
        setOtherUser(res?.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getOtherUser();
  }, [conversation, currentUser]);

  return (
    <div className="cursor-pointer flex items-center space-x-5">
      <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
        <Image
          src={
            otherUser?.profilePicture
              ? otherUser?.profilePicture
              : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
          }
          alt="logo"
          layout="fill"
          className="rounded-full cursor-pointer"
        />
      </div>

      <p className="text-lg font-libre tracking-wider text-sm1 font-semibold capitalize">
        {otherUser?.username}
      </p>
    </div>
  );
};

export default Conversation;
