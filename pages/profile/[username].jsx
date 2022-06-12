import Image from "next/image";
import UserFeed from "../../components/Userfeed/UserFeed";
import ProfileRightside from "../../components/ProfileRightside";
import Layout from "../../components/layout/Layout";
import Head from "next/head";
import { MdAdd } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { USERNAME_POSTS } from "../../components/constants/Constant";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseAPI } from "../../components/constants/Constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserProfile = ({ userPosts }) => {
  //getting the signed in user
  const { user } = useSelector((state) => ({ ...state.auth }));
  //getting the user details
  const userDetails = userPosts?.currentUser;
  const userFeeds = userPosts?.usernamePosts;

  //states

  const [userFollowers, setUserFollowers] = useState([]);

  //getting the user followers from the data
  useEffect(() => {
    const getFollowers = async () => {
      try {
        const followersList = await axios.get(
          `${baseAPI}/user/followers/${userDetails._id}`
        );
        setUserFollowers(followersList?.data.userFollowers);
      } catch (error) {
        console.log(error);
      }
    };
    getFollowers();
  }, [userDetails?._id]);

  const profileFollowers = userFollowers?.map(
    (userfollower) => userfollower._id
  );

  //handle follow
  const handleFollow = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseAPI}/${userDetails._id}/follow`, {
        userId: user?.user._id,
      });
      toast.success("Followed");
    } catch (error) {
      console.log(error);
    }
  };

  //handle unfollow
  const handleUnFollow = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseAPI}/${userDetails._id}/unfollow`, {
        userId: user?.user._id,
      });
      toast.success("Unfollowed");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-b-md space-y-3">
      <Head>
        <title>User-Profile</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <div className="relative max-w-full mx-auto h-44 2xl:h-60">
          <Image
            src={
              userDetails?.coverPicture
                ? userDetails?.coverPicture
                : "https://images.pond5.com/blue-programming-code-background-abstract-footage-090894338_prevstill.jpeg"
            }
            alt="logo"
            layout="fill"
            className="cursor-pointer rounded-b-md object-cover"
          />
        </div>
        <div className="flex flex-col items-center justify-center -mt-14 2xl::-mt-20">
          <div className="relative w-12 h-12 z-40">
            <Image
              src={
                userDetails?.profilePicture
                  ? userDetails?.profilePicture
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="logo"
              layout="fill"
              className="cursor-pointer rounded-full "
            />
          </div>
          <div className="flex items-center space-x-2">
            <p className="mt-2 text-sm1 text-lg 2xl:text-xl font-charm tracking-wider font-bold">
              {userDetails?.firstName + " " + userDetails?.lastName}
            </p>
            {profileFollowers.includes(user?.user._id) ? (
              <button
                className="bg-sm2 px-3 py-1 rounded-lg space-x-1  flex items-center"
                onClick={handleUnFollow}
              >
                <span className="text-sm7 font-charm tracking-wider font-semibold">
                  Unfollow
                </span>
                <GrFormSubtract className="w-6 h-6" />
              </button>
            ) : userDetails._id === user?.user._id ? null : (
              <button
                className="bg-sm2 px-3 py-1 rounded-lg space-x-1  flex items-center"
                onClick={handleFollow}
              >
                <span className="text-sm7 font-charm tracking-wider font-semibold">
                  Follow
                </span>
                <MdAdd className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <UserFeed userFeeds={userFeeds} userDetails={userDetails} />
        <ProfileRightside userDetails={userDetails} />
      </div>
    </div>
  );
};

UserProfile.Layout = Layout;

export default UserProfile;

//server side rendering

export async function getServerSideProps(context) {
  const { username } = context.query;
  const res = await fetch(`${USERNAME_POSTS}/${username}`);
  const data = await res.json();

  return {
    props: {
      userPosts: data,
    },
  };
}

// export async function getServerSideProps(context) {
//   const { username } = context.query;
//   const [userPostsRes, userDetailsRes] = await Promise.all([
//     fetch(
//       `https://social-media-backend-one.vercel.app/milesapi/usernameposts/${username}`
//     ),
//     fetch(
//       `https://social-media-backend-one.vercel.app/milesapi/userDetails/${username}`
//     ),
//   ]);

//   const [userPosts, userDetails] = await Promise.all([
//     userPostsRes.json(),
//     userDetailsRes.json(),
//   ]);

//   return {
//     props: {
//       userPosts,
//       userDetails,
//     },
//   };
// }
