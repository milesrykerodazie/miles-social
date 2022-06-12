import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Users } from "../../public/assets/dummyData";
import ReadMoreReadLess from "../Helpers/ReadMoreReadLess";
import moment from "moment";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const UserFeedPosts = ({ userDetails, post }) => {
  // getting the user from the user data from redux using useSelector
  const { user } = useSelector((state) => ({ ...state.auth }));

  //states for likes
  const [likes, setLikes] = useState(post?.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  //checking if user has already liked a post
  useEffect(() => {
    setIsLiked(post?.likes.includes(user?.user._id));
    toast.dismiss();
  }, [user?.user._id, post?.likes]);

  //handle the like post
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseAPI}/likepost/${post?._id}`, {
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
      toast.warn("Unliked");
    }
  };

  return (
    <div className="bg-sm1 rounded-lg shadow-md shadow-sm2/70 p-2 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 ">
          <div className="relative w-6 h-6 2xl:w-10 2xl:h-10">
            <Image
              src={
                userDetails?.profilePic
                  ? userDetails?.profilePic
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="logo"
              layout="fill"
              className="rounded-full cursor-pointer object-cover"
            />
          </div>
          <p className="cursor-pointer text-lg font-quicksand text-sm7 tracking-wider font-semibold capitalize">
            {userDetails?.username}
          </p>

          <span className="text-xs 2xl:text-sm text-sm6 font-semibold font-quicksand flex items-center space-x-2">
            <span>{format(post?.createdAt)}</span>
            <span className="hidden md:inline-flex">
              ({moment(post?.createdAt).format("lll")})
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
          {post?.description}
        </ReadMoreReadLess>
      </div>
      <div className="relative w-full h-32 sm:h-60 md:h-80 lg:h-[400px]">
        <Image
          src={
            post?.img
              ? post.img
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

export default UserFeedPosts;
