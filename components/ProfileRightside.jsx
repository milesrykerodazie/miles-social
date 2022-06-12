import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { baseAPI } from "./constants/Constant";

const ProfileRightside = ({ userDetails }) => {
  //states
  const [userFollowings, setUserFollowings] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);

  //router
  const router = useRouter();

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

  return (
    <div className=" bg-sm2 p-2 rounded-md h-[calc(100vh-100px)] sticky top-[84px] hidden lg:inline-block xl:w-[30%]">
      {/* events */}
      <div className="space-y-2">
        <p className="text-lg 2xl:text-2xl font-charm text-sm7 tracking-wider font-semibold">
          User Information
        </p>
        <div className="space-y-1">
          <p className="font-charm text-sm 2xl:text-xl tracking-wider text-sm7">
            <b>City:</b> Obigbo.
          </p>
          <p className="font-charm text-sm 2xl:text-xl tracking-wider text-sm7">
            <b>From:</b> AlaIgbo.
          </p>
          <p className="font-charm text-sm 2xl:text-xl tracking-wider text-sm7">
            <b>Relationship:</b> Polygamous.
          </p>
        </div>
      </div>

      {/* User followings */}
      <p className="font-charm text-sm 2xl:text-xl text-sm1 tracking-widest bg-sm7 px-2 py-1 rounded-t-md mt-4">
        Following
      </p>
      {userFollowings?.length === 0 ? (
        <p>You do not follow anyone</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {userFollowings.map((userFollowing) => (
            <div
              key={userFollowing._id}
              className="space-y-1 cursor-pointer"
              onClick={() => router.push(`/profile/${userFollowing?.username}`)}
            >
              {userFollowing.profilePicture ? (
                <div className="relative w-14 h-14 2xl:w-16 2xl:h-16 ">
                  <Image
                    src={userFollowing.profilePicture}
                    alt="userPic"
                    layout="fill"
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 2xl:w-16 2xl:h-16  rounded-lg cursor-pointer bg-sm7 flex items-center justify-center">
                  <p className="text-sm1 text-xl">
                    {userFollowing.firstName[0] + userFollowing.lastName[0]}
                  </p>
                </div>
              )}

              <p className="font-charm text-sm7 text-sm tracking-widest truncate capitalize">
                {userFollowing.username}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* User followers */}
      <p className="font-charm text-sm 2xl:text-xl text-sm1 tracking-widest bg-sm7 px-2 py-1 rounded-t-md mt-4">
        Followers
      </p>
      {userFollowers?.length === 0 ? (
        <p>No followers for now</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {userFollowers.map((userFollower) => (
            <div
              key={userFollower._id}
              className="space-y-1 cursor-pointer"
              onClick={() => router.push(`/profile/${userFollower?.username}`)}
            >
              {userFollower?.profilePicture ? (
                <div className="relative w-14 h-14 2xl:w-16 2xl:h-16 ">
                  <Image
                    src={userFollower.profilePicture}
                    alt="userPic"
                    layout="fill"
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 2xl:w-16 2xl:h-16  rounded-lg cursor-pointer bg-sm7 flex items-center justify-center">
                  <p className="text-sm1 text-xl">
                    {userFollower?.firstName[0] + userFollower?.lastName[0]}
                  </p>
                </div>
              )}

              <p className="font-charm text-sm7 text-sm tracking-widest truncate capitalize">
                {userFollower.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileRightside;
