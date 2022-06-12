import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import ReadMoreReadLess from "../Helpers/ReadMoreReadLess";
import axios from "axios";
import { baseAPI } from "../constants/Constant";
import { useEffect, useState } from "react";
import FeedTop from "./FeedTop";
import { format } from "timeago.js";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const FeedPosts = ({ feedPostData }) => {
  const [userDetails, setUserDetails] = useState({});
  const { user } = useSelector((state) => ({ ...state.auth }));

  //states for likes
  const [likes, setLikes] = useState(feedPostData.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  // getting the user from the user data and matching it with the user id in post data
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get(`${baseAPI}/user/${feedPostData?.userId}`);
        setUserDetails(res?.data.user);
      };
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  }, [feedPostData?.userId]);

  //checking if user has already liked a post
  useEffect(() => {
    setIsLiked(feedPostData?.likes?.includes(user?.user._id));
  }, [user?.user._id, feedPostData?.likes]);

  // const user = Users.filter((user) => user.id === post.userId)[0].username;
  //router
  const router = useRouter();

  //handle the like post
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseAPI}/likepost/${feedPostData?._id}`, {
        userId: user?.user._id,
      });
    } catch (error) {
      console.log(error);
    }
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);

    if (!isLiked) {
      toast.success("Liked");
    } else {
      toast.error("Unliked");
    }
  };

  return (
    <div className="bg-sm1 rounded-lg shadow-md shadow-sm2/70 p-2 space-y-3 md:space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 ">
          <div
            className="relative w-10 h-10 2xl:w-12 2xl:h-12"
            onClick={() => router.push(`/profile/${userDetails?.username}`)}
          >
            <Image
              src={
                userDetails?.profilePicture
                  ? userDetails?.profilePicture
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="logo"
              layout="fill"
              className="rounded-full cursor-pointer"
            />
          </div>
          <p className="cursor-pointer text-base 2xl:text-lg font-quicksand text-sm7 tracking-wider font-semibold capitalize">
            {userDetails?.username}
          </p>
          <span className="text-xs 2xl:text-sm text-sm6 font-semibold font-quicksand flex items-center space-x-2">
            <span>{format(feedPostData?.createdAt)}</span>
            <span className="hidden md:inline-flex">
              ({moment(feedPostData?.createdAt).format("lll")})
            </span>
          </span>
        </div>
        <div className="pr-3">
          <BsThreeDotsVertical className="text-sm7 w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <div>
        <ReadMoreReadLess
          textSize="lg"
          smallTextSize="sm"
          limit="100"
          font="quicksand"
          textColor="sm7"
          fontWeight="bold"
        >
          {feedPostData?.description}
        </ReadMoreReadLess>
      </div>
      <div className="relative w-full h-32 sm:h-60 md:h-80 lg:h-[400px] object-fill">
        <Image
          src={
            feedPostData?.img
              ? feedPostData.img
              : "https://images.pond5.com/blue-programming-code-background-abstract-footage-090894338_prevstill.jpeg"
          }
          alt="logo"
          objectFit="cover"
          layout="fill"
          className="rounded-md"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="bg-white h-7 w-7 flex items-center justify-center rounded-full"
            onClick={handleLike}
          >
            {isLiked ? (
              <AiFillLike className="text-sm6 w-5 h-5 cursor-pointer text-center" />
            ) : (
              <AiOutlineLike className="text-sm6 w-5 h-5 cursor-pointer text-center" />
            )}
          </div>
          <p className="font-quicksand text-sm text-sm7 ">
            {likes !== 0 && (
              <>
                <b>{likes}</b> {likes === 1 ? "person" : "people"}{" "}
                {likes === 1 ? "likes" : "like"} this post
              </>
            )}
          </p>
        </div>
        <p className="text-lg text-sm7  font-quicksand">
          <b>9</b> comments
        </p>
      </div>
    </div>
  );
};
