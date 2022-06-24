import Image from "next/image";
import UserFeed from "../../components/Userfeed/UserFeed";
import ProfileRightside from "../../components/ProfileRightside";
import Layout from "../../components/layout/Layout";
import Head from "next/head";
import { MdAdd } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { AiFillEdit } from "react-icons/ai";
import { USERNAME_POSTS } from "../../components/constants/Constant";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseAPI } from "../../components/constants/Constant";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const UserProfile = ({ userPosts }) => {
  //getting the signed in user
  const { user } = useSelector((state) => ({ ...state.auth }));
  //getting the user details
  const userDetails = userPosts?.currentUser;
  const userFeeds = userPosts?.usernamePosts;
  const username = userPosts?.currentUser?.username;

  //router
  const router = useRouter();

  //refresh page function
  const refreshPage = () => {
    router.replace(router.asPath);
  };

  //states

  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowings, setUserFollowings] = useState([]);

  //getting the user followings from the data
  useEffect(() => {
    const getFollowings = async () => {
      try {
        const friendsList = await axios.get(
          `${baseAPI}/user/${userDetails._id}/followings`
        );
        setUserFollowings(friendsList?.data.friends);
      } catch (error) {
        console.log(error);
      }
    };
    getFollowings();
  }, [userDetails?._id]);

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

  //toEditProfile
  const editProfile = (e) => {
    e.preventDefault();
    router.push(`/editprofile/${username}`);
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
        <div className="relative max-w-full mx-auto h-40 2xl:h-60">
          <Image
            priority
            src={
              userDetails?.coverPicture
                ? userDetails?.coverPicture
                : "https://images.pond5.com/blue-programming-code-background-abstract-footage-090894338_prevstill.jpeg"
            }
            alt="logo"
            layout="fill"
            className="cursor-pointer rounded-b-md object-cover"
          />
          <div className="absolute top-0 right-0" onClick={editProfile}>
            <button className="flex items-center space-x-2 bg-sm5 px-5 py-2 rounded-bl-lg">
              <p className="text-sm1 font-charm text-base lg:text-lg tracking-wider font-semibold">
                Edit
              </p>
              <AiFillEdit className="text-sm1 cursor-pointer w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center -mt-6 lg:-mt-10">
          <div className="relative w-12 h-12 lg:w-16 lg:h-16 z-40">
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
            <p className="mt-1 text-sm1 text-lg 2xl:text-xl font-charm tracking-wider font-bold">
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
          {/* showing followers on mobile */}
          <div className="flex items-center space-x-4 lg:hidden mt-3">
            <p className="text-sm1 font-libre tracking-wider text-sm shadow-sm shadow-sm1 p-2 rounded-sm font-semibold">
              Followers{" "}
              <span className="bg-sm5 px-3 py-1 rounded-md">
                {userFollowers?.length}
              </span>
            </p>
            <p className="text-sm1 font-libre tracking-wider text-sm shadow-sm shadow-sm1 p-2 rounded-sm font-semibold">
              Following{" "}
              <span className="bg-sm5 px-3 py-1 rounded-md">
                {userFollowings?.length}
              </span>
            </p>
          </div>
          {/* showing user info on mobile */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4 lg:hidden mt-3">
              <div className="text-sm1 font-libre tracking-wider text-sm shadow-sm shadow-sm1 p-2 rounded-sm font-semibold flex items-center space-x-1">
                <p className="text-sm font-libre tracking-wider">Country :</p>
                <p className="text-xs font-libre tracking-wider">
                  {userDetails?.country}
                </p>
              </div>
              <div className="text-sm1 font-libre tracking-wider text-sm shadow-sm shadow-sm1 p-2 rounded-sm font-semibold flex items-center space-x-1">
                <p className="text-sm font-libre tracking-wider">
                  Relationship :
                </p>
                <p className="text-xs font-libre tracking-wider">
                  {userDetails?.relationships}
                </p>
              </div>
            </div>
            <div className="text-sm1 font-libre tracking-wider text-sm shadow-sm shadow-sm1 p-2 rounded-sm font-semibold flex items-center space-x-1">
              <p className="text-sm font-libre tracking-wider">Bio :</p>
              <p className="text-xs font-libre tracking-wider">
                {userDetails?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <UserFeed
          userFeeds={userFeeds}
          userDetails={userDetails}
          refreshPage={refreshPage}
        />
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
