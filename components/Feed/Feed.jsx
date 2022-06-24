import LoadingSkeleton from "../loadingComponent/LoadingSkeleton";
import { FeedPosts } from "./FeedPosts";
import FeedTop from "./FeedTop";

const Feed = ({ feedData, forceUpdate }) => {
  return (
    <div className="px-3 w-full lg:w-[70%]">
      <div className="sticky top-[60px] lg:top-[80px] z-40">
        <FeedTop forceUpdate={forceUpdate} />
      </div>
      {!feedData ? (
        <div className="space-y-4">
          <div className="animate-fastpulse">
            <LoadingSkeleton />
          </div>
          <div
            className="animate-fastpulse"
            style={{
              animationFillMode: "backwards",
              animationDelay: "350ms",
            }}
          >
            <LoadingSkeleton />
          </div>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-5">
          {feedData?.map((feedPostData) => (
            <FeedPosts
              key={feedPostData._id}
              feedPostData={feedPostData}
              forceUpdate={forceUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
