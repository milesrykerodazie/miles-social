import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { ImSpinner3 } from "react-icons/im";
import Layout from "../../components/layout/Layout";
import {
  baseAPI,
  SINGLE_POST,
  GET_POST_COMMENTS,
} from "../../components/constants/Constant";
import RightSide from "../../components/RightSide";
import { toast } from "react-toastify";
import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReadMoreReadLess from "../../components/Helpers/ReadMoreReadLess";
import axios from "axios";
import { format } from "timeago.js";
import moment from "moment";
import { useRouter } from "next/router";
import Comment from "../../components/comments/Comment";
import CommentLoader from "../../components/loadingComponent/CommentLoader";

const Post = ({ postData }) => {
  //getting the user
  const { user } = useSelector((state) => ({ ...state.auth }));
  const [userDetails, setUserDetails] = useState({});
  const username = userDetails?.username;

  //router
  const router = useRouter();

  //states for likes
  const [likes, setLikes] = useState(postData?.post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  // getting the user from the user data and matching it with the user id in post data
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get(`${baseAPI}/user/${postData?.post.userId}`);
        setUserDetails(res?.data.user);
      };
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  }, [postData?.post.userId]);

  //checking if user has already liked a post
  useEffect(() => {
    setIsLiked(postData?.post.likes?.includes(user?.user._id));
  }, [user?.user._id, postData?.post.likes]);

  // const user = Users.filter((user) => user.id === post.userId)[0].username;

  //handle the like post
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseAPI}/likepost/${postData?.post._id}`, {
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
    if (postData?.post.userId !== user?.user._id) {
      toast.error("You can't delete this post");
      return;
    }
    try {
      setDeleting(true);
      await axios.delete(`${baseAPI}/deletepost/${postData?.post._id}`);
      router.push(`/profile/${username}`);
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

  //the comment section
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  //ref for the comment input field
  const commentMessage = useRef();

  const [comments, setComments] = useState();
  const [fetching, setFetching] = useState(false);
  const [posting, setPosting] = useState(false);

  // getting the data from the api
  useEffect(() => {
    try {
      const fetchComments = async () => {
        setFetching(true);
        const commentRes = await axios.get(
          `${GET_POST_COMMENTS}/${postData?.post._id}`
        );
        setComments(commentRes?.data);
        setFetching(false);
      };
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  }, [postData?.post._id, reducerValue]);

  //handle post comment
  const handleComment = async (e) => {
    e.preventDefault();
    const comment = commentMessage.current.value;
    console.log("comment typed => ", comment);
    if (comment === "") {
      toast.error("Please enter a comment");
      return;
    }
    try {
      setPosting(true);
      const newComment = await axios.post(`${baseAPI}/comment`, {
        postId: postData?.post._id,
        sender: user?.user._id,
        senderPic: user?.user.profilePicture,
        senderUsername: user?.user.username,
        comment: comment,
      });
      setPosting(false);
      setComments((prevComments) => [...prevComments, newComment.data]);
    } catch (error) {
      console.log(error);
    }
    commentMessage.current.value = "";
    toast.success("Comment posted successfully!!");
  };

  return (
    <div className="flex">
      <div className="w-full lg:w-[70%] p-3 rounded-lg shadow-lg shadow-sm1/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 ">
            <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
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
            <p className="cursor-pointer text-base 2xl:text-lg font-quicksand text-sm1 tracking-wider font-semibold capitalize">
              {userDetails?.username}
            </p>
            <span className="text-xs 2xl:text-sm text-sm1 font-semibold font-quicksand flex items-center space-x-2">
              <span>{format(postData?.post.createdAt)}</span>
              <span className="hidden md:inline-flex">
                ({moment(postData?.post.createdAt).format("lll")})
              </span>
            </span>
          </div>
          {/* delete here */}
          {postData?.post.userId === user?.user._id && (
            <div className="relative">
              {deleting === false && (
                <div
                  className="pr-3"
                  onClick={() => setOpenDelete(!openDelete)}
                >
                  <BsThreeDotsVertical className="text-sm1 w-5 h-5 cursor-pointer" />
                </div>
              )}

              {openDelete && (
                <div
                  className="shadow-lg shadow-sm1 px-3 py-2 absolute top-7 right-0 rounded-md cursor-pointer"
                  onClick={handleConfirmDelete}
                >
                  <p className="font-quicksand text-sm lg:text-base text-sm1">
                    Delete
                  </p>
                </div>
              )}
              {deleting === true ? (
                <div className="flex items-center space-x-1">
                  <p className="animate-slowpulse text-lg text-sm1">
                    Deleting...
                  </p>
                  <ImSpinner3 className="w-6 h-6 animate-spin text-sm1" />
                </div>
              ) : (
                <div>
                  {confirmDelete && (
                    <div className="shadow-lg shadow-sm1 px-3 py-2 absolute top-7 right-0 rounded-md">
                      <div className="text-sm lg:text-base font-quicksand flex items-center space-x-4">
                        <p
                          className="cursor-pointer border-b-2 border-sm1 text-sm1"
                          onClick={handleDelete}
                        >
                          Confirm
                        </p>
                        <span>/</span>
                        <p
                          className="cursor-pointer text-sm1 font-bold"
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
            textColor="sm1"
            fontWeight="bold"
          >
            {postData?.post.description}
          </ReadMoreReadLess>
        </div>
        <div className="relative w-full h-60 lg:h-[400px] object-fill">
          <Image
            src={
              postData?.post.img
                ? postData?.post.img
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
          <p className="text-lg text-sm1  font-quicksand flex items-center space-x-2 cursor-pointer">
            {comments?.length !== 0 && <b>{comments?.length}</b>}{" "}
            {comments?.length === 0 ? (
              <span className="text-sm text-sm1">No comments</span>
            ) : comments?.length === 1 ? (
              <span className="text-sm text-sm1">Comment</span>
            ) : (
              <span className="text-sm text-sm1">Comments</span>
            )}
          </p>
        </div>
        {fetching ? (
          <div className="space-y-3">
            <div className="animate-fastpulse">
              <CommentLoader />
            </div>
            <div
              className="animate-fastpulse"
              style={{
                animationFillMode: "backwards",
                animationDelay: "350ms",
              }}
            >
              <CommentLoader />
            </div>
            <div
              className="animate-fastpulse"
              style={{
                animationFillMode: "backwards",
                animationDelay: "550ms",
              }}
            >
              <CommentLoader />
            </div>
            <div
              className="animate-fastpulse"
              style={{
                animationFillMode: "backwards",
                animationDelay: "650ms",
              }}
            >
              <CommentLoader />
            </div>
          </div>
        ) : (
          <>
            {comments?.length !== 0 ? (
              <div>
                <p className="mb-2 text-sm1 font-quicksand">Comments</p>
                <div className="h-[300px] overflow-y-auto space-y-3 bg-sm1 shadow-md shadow-sm3 pl-2 pr-2 lg:pr-5 py-3 rounded-md">
                  {comments?.map((comment) => (
                    <div key={comment?._id}>
                      <Comment comment={comment} forceUpdate={forceUpdate} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-sm1 font-quicksand">No comments</p>
              </div>
            )}
          </>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Comment here"
            required
            ref={commentMessage}
            className="w-full bg-transparent shadow-sm shadow-sm1 px-2 py-1 text-sm1 outline-none border border-sm3 rounded-md tracking-wider text-xs lg:text-sm"
          />
          {posting ? (
            <div className="flex items-center space-x-1">
              <p className="animate-slowpulse text-xs text-sm1">posting...</p>
              <ImSpinner3 className="w-4 h-4 animate-spin text-sm1" />
            </div>
          ) : (
            <button
              className="bg-sm1 px-2 py-1 text-xs lg:text-sm font-quicksand rounded-md"
              onClick={handleComment}
            >
              Comment
            </button>
          )}
        </div>
      </div>
      <RightSide />
    </div>
  );
};

export default Post;

Post.Layout = Layout;

//server side rendering of single post

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`${SINGLE_POST}/${id}`);
  const data = await res.json();

  return {
    props: {
      postData: data,
    },
  };
}
