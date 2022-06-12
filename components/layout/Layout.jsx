import Header from "../Header";
import LeftSide from "../LeftSide";
import MobileHeader from "../MobileHeader";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  //getting the user from redux using use selector
  const { user } = useSelector((state) => ({ ...state.auth }));

  //router
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return (
    <div className="">
      <div>
        <header className="hidden lg:inline-flex">
          <Header />
        </header>
        <header className="lg:hidden ">
          <MobileHeader />
        </header>
        {/* {user && (
          <div
            className="text-2xl fixed bottom-2 right-4 z-70 bg-sm6 p-2 rounded-full motion-safe:animate-pulse lg:hidden"
            onClick={() => setOnlineOpen(!onlineOpen)}
          >
            <BsFillChatDotsFill className="w-10 h-10 text-sm2" />
          </div>
        )}

        <div className="lg:hidden">
          <OnlineFriends
            onlineOpen={onlineOpen}
            setOnlineOpen={setOnlineOpen}
          />
        </div> */}
      </div>
      {user && (
        <div className="md:flex md:max-w-[95%] lg:max-w-[80%] mx-auto pb-5 mt-[56px]">
          <div className="md:w-1/5 hidden lg:inline-block">
            <LeftSide />
          </div>
          <div className="w-full lg:w-4/5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Layout;
