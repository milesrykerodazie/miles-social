import LoadingSkeleton from "../loadingComponent/LoadingSkeleton";
import UserFeedPosts from "./UserFeedPosts";
import UserFeedTop from "./UserFeedTop";

const UserFeed = ({ userFeeds, userDetails, refreshPage }) => {
  return (
    <div className="px-3 w-full xl:w-[70%]">
      <div className="sticky top-[60px] lg:top-[80px] z-40">
        <UserFeedTop userDetails={userDetails} refreshPage={refreshPage} />
      </div>
      {!userFeeds ? (
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
          {userFeeds?.map((post) => (
            <UserFeedPosts
              key={post?._id}
              post={post}
              userDetails={userDetails}
              refreshPage={refreshPage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFeed;
