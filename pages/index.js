import Head from "next/head";
import Feed from "../components/Feed/Feed";
import RightSide from "../components/RightSide";
import Layout from "../components/layout/Layout";
import { TIMELINE_POSTS } from "../components/constants/Constant";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useReducer } from "react";

export default function Home() {
  //getting the uswr from redux using the useSelector hook
  const { user } = useSelector((state) => ({ ...state.auth }));
  const userId = user?.user._id;
  // getting online users
  const onlineFriends = useSelector((state) => state.auth.usersOnline);

  //state fror timeline posts
  const [timelinePosts, setTimelinePosts] = useState([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  //getting the timeline posts from the api
  useEffect(() => {
    if (!userId) {
      return;
    }
    const getTimelinePosts = async () => {
      try {
        const timelineRes = await axios.get(`${TIMELINE_POSTS}/${userId}`);
        setTimelinePosts(timelineRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTimelinePosts();
  }, [userId, reducerValue]);

  //removing unnecessary data from the api
  const feedData = timelinePosts?.timelinePosts;

  return (
    <div className="">
      <Head>
        <title>SM-App</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex ">
        <Feed feedData={feedData} forceUpdate={forceUpdate} />
        <RightSide onlineFriends={onlineFriends} />
      </main>
    </div>
  );
}

Home.Layout = Layout;
