import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { ImSpinner3 } from "react-icons/im";
import ReadMoreReadLess from "../Helpers/ReadMoreReadLess";
import moment from "moment";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseAPI, GET_POST_COMMENTS } from "../constants/Constant";
import axios from "axios";

const UserFeedPosts = ({ userDetails, post }) => {
  // post id
  const id = post?._id;
  // getting the user from the user data from redux using useSelector
  const { user } = useSelector((state) => ({ ...state.auth }));

  // getting the router from next/router
  const router = useRouter();

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

  //state for open delete
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // handle open delete
  const handleConfirmDelete = (e) => {
    e.preventDefault();
    setOpenDelete(false);
    setConfirmDelete(true);
  };

  // handle delete post
  const handleDelete = async (e) => {
    e.preventDefault();
    if (post?.userId !== user?.user._id) {
      toast.error("You can't delete this post");
      return;
    }
    try {
      setDeleting(true);
      const response = await axios.delete(`${baseAPI}/deletepost/${post?._id}`);
      router.replace(router.asPath);
      setDeleting(false);
      setConfirmDelete(false);
      setOpenDelete(false);
      toast.success("Post deleted successfully!!");
    } catch (error) {
      toast.error(error?.response?.data.message);
      setDeleting(false);
      setConfirmDelete(false);
      setOpenDelete(false);
    }
  };

  //getting the length of comments for each post
  const [commentsLength, setCommentsLength] = useState(0);
  // getting the data from the api
  useEffect(() => {
    try {
      const fetchComments = async () => {
        const commentRes = await axios.get(`${GET_POST_COMMENTS}/${id}`);
        setCommentsLength(commentRes?.data.length);
      };
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  return (
    <div className="bg-sm1 rounded-lg shadow-md shadow-sm2/70 p-2 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 ">
          <div className="relative w-6 h-6 2xl:w-10 2xl:h-10">
            <Image
              src={
                userDetails?.profilePicture
                  ? userDetails?.profilePicture
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
        {/* delete here */}
        {post?.userId === user?.user._id && (
          <div className="relative">
            {deleting === false && (
              <div className="pr-3" onClick={() => setOpenDelete(!openDelete)}>
                <BsThreeDotsVertical className="text-sm7 w-5 h-5 cursor-pointer" />
              </div>
            )}

            {openDelete && (
              <div
                className="shadow-lg shadow-sm7 px-3 py-2 absolute top-7 right-0 rounded-md cursor-pointer"
                onClick={handleConfirmDelete}
              >
                <p className="font-quicksand text-sm lg:text-base">Delete</p>
              </div>
            )}
            {deleting === true ? (
              <div className="flex items-center space-x-1">
                <p className="animate-slowpulse text-lg text-sm7">
                  Deleting...
                </p>
                <ImSpinner3 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div>
                {confirmDelete && (
                  <div className="shadow-lg shadow-sm7 px-3 py-2 absolute top-7 right-0 rounded-md">
                    <div className="text-sm lg:text-base font-quicksand flex items-center space-x-4">
                      <p
                        className="cursor-pointer border-b-2 border-sm6"
                        onClick={handleDelete}
                      >
                        Confirm
                      </p>
                      <span>/</span>
                      <p
                        className="cursor-pointer text-sm7 font-bold"
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
      <div className="relative w-full h-60 lg:h-[400px]">
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
        <p
          className="text-lg text-sm7  font-quicksand flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push(`/post/${id}`)}
        >
          {commentsLength !== 0 && <b>{commentsLength}</b>}{" "}
          {commentsLength === 0 ? (
            <span className="text-sm text-sm7">No comments</span>
          ) : commentsLength === 1 ? (
            <span className="text-sm text-sm7">Comment</span>
          ) : (
            <span className="text-sm text-sm7">Comments</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserFeedPosts;
