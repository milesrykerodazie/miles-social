import { MdClose } from "react-icons/md";
import { MdDynamicFeed, MdVideoLabel, MdGroup, MdSchool } from "react-icons/md";
import { AiFillWechat, AiFillBook } from "react-icons/ai";
import {
  BsFillQuestionSquareFill,
  BsFillHandbagFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";

const MobileLeftside = ({ nav, setNav }) => {
  return (
    <div
      className={
        nav
          ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-700"
          : "lg:hidden fixed -left-[100%] top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-900"
      }
    >
      <div
        className={
          nav
            ? "fixed top-0 left-0 h-screen bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%]  md:w-[55%] ease-in duration-900 z-80 pt-3 px-3"
            : "fixed -left-[100%] top-0 ease-in duration-700 bg-gradient-to-r from-sm6 via-sm3 to-sm6 w-[75%] md:w-[55%] h-screen z-80 pt-3 px-3"
        }
      >
        <div className="flex justify-end">
          <div
            onClick={() => setNav(!nav)}
            className="flex items-center justify-center bg-sm7 rounded-full w-7 h-7"
          >
            <MdClose className="w-5 h-5 text-sm1" />
          </div>
        </div>
        {/* the side bar tools */}
        <div className="space-y-5 md:space-y-7">
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdDynamicFeed className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Feed
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <AiFillWechat className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Chats
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdVideoLabel className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Videos
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdGroup className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Groups
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <AiFillBook className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Bookmarks
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <BsFillQuestionSquareFill className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Questions
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <BsFillHandbagFill className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Jobs
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <BsFillCalendarEventFill className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Event
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdSchool className="md:w-8 md:h-8 w-7 h-7 text-sm1" />
            <p className="text-xl md:text-2xl font-rancho tracking-widest text-sm7 font-semibold">
              Courses
            </p>
          </div>
          <button className="bg-sm1 text-sm7 px-3 md:px-5 2xl:py-2 text-xl md:text-2xl font-rancho tracking-wider rounded-sm 2xl:rounded-md">
            Show More
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLeftside;
