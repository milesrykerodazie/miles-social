import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../public/assets/social-logo2.png";
import { BsSearch, BsFillPersonFill } from "react-icons/bs";
import { SiGooglemessages } from "react-icons/si";
import { MdNotifications } from "react-icons/md";
import { BiDownArrow, BiUpArrow, BiLogOutCircle } from "react-icons/bi";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setLogOut } from "../redux/features/authSlice";
import { persistor } from "../redux/store";

const Header = () => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  const id = user?.user?._id;
  const username = user?.user?.username;
  const userPicture = user?.user?.profilePicture;

  const [isOpen, setIsOpen] = useState(false);
  const [pageScroll, setPageScroll] = useState(false);

  //useEffect for page scroll
  useEffect(() => {
    const scrl = window.addEventListener("scroll", () =>
      setPageScroll(window.scrollY > 90)
    );
    return scrl;
  }, [pageScroll]);

  // handle is open
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  //dispatch
  const dispatch = useDispatch();

  // calling the route
  const router = useRouter();

  //toProfile
  const toProfile = (e) => {
    e.preventDefault();
    router.push(`/profile/${username}`);
    setIsOpen(false);
  };

  //toMessage
  const toMessage = (e) => {
    e.preventDefault();
    router.push(`/messenger/${id}`);
    setIsOpen(false);
  };

  // logout the user
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(setLogOut(user));
    persistor.purge(user);
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <div
      className={`bg-sm4 flex items-center justify-between fixed top-0 w-full h-[80px] z-50 duration-400 ease-in ${
        pageScroll && "shadow-md shadow-sm4"
      }`}
    >
      <div className="flex items-center space-x-1 p-2 w-full">
        <div className="relative w-12 h-12 2xl:w-16 2xl:h-16">
          <Image
            src={logo}
            alt="logo"
            layout="fill"
            className="animate-pulse"
          />
        </div>
        <h1 className="text-white text-lg 2xl:text-2xl font-satisfy tracking-widest cursor-pointer">
          Miles Social
        </h1>
      </div>
      {user && (
        <div className="flex items-center space-x-1 bg-sm1 w-full rounded-full">
          <BsSearch className="ml-3 w-4 h-4 2xl:w-5 2xl:h-5" />
          <input
            type="text"
            placeholder="Search here"
            className="bg-transparent w-full outline-none py-2 2xl:py-3 px-2 text-lg text-sm8 2xl:placeholder:text-lg placeholder:text-base placeholder:text-sm3 placeholder:font-satisfy placeholder:tracking-wider"
          />
        </div>
      )}

      <div className="w-full ml-5 xl:ml-10 flex items-center justify-between mr-5">
        <div className="flex items-center space-x-3 xl:space-x-5 text-white">
          <p
            className="text-base 2xl:text-xl font-satisfy tracking-widest cursor-pointer"
            onClick={() => router.push("/")}
          >
            Home
          </p>
          <p className="text-base 2xl:text-xl font-satisfy tracking-widest cursor-pointer">
            TimeLine
          </p>
        </div>
        <div className="flex items-center space-x-5 xl:space-x-10">
          <div className="relative cursor-pointer">
            <BsFillPersonFill className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
            <p className="bg-sm6 h-4 w-4 2xl:h-5 2xl:w-5 flex items-center justify-center rounded-full absolute -top-2 2xl:left-3 left-2">
              <span className="text-white text-[10px] text-center ">1</span>
            </p>
          </div>
          <div className="relative cursor-pointer" onClick={toMessage}>
            <SiGooglemessages className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
            <p className="bg-sm6 h-4 w-4 2xl:h-5 2xl:w-5 flex items-center justify-center rounded-full absolute -top-2 2xl:left-4 left-3">
              <span className="text-white text-[10px] text-center ">3</span>
            </p>
          </div>
          <div className="relative cursor-pointer">
            <MdNotifications className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
            <p className="bg-sm6 h-4 w-4 2xl:h-5 2xl:w-5 flex items-center justify-center rounded-full absolute -top-2 2xl:left-3 left-2">
              <span className="text-white text-[10px] text-center ">20</span>
            </p>
          </div>
        </div>
        {user && (
          <div
            className="flex flex-col items-center 2xl:mr-3"
            onClick={handleOpen}
          >
            <div className="relative w-10 h-10 2xl:w-12 2xl:h-12 -mt-2">
              <Image
                priority
                src={
                  userPicture
                    ? userPicture
                    : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                }
                alt="logo"
                layout="fill"
                className="rounded-full cursor-pointer"
              />
            </div>
            <div className="absolute 2xl:mt-9 mt-7">
              {isOpen ? (
                <BiUpArrow className="2xl:w-6 2xl:h-6 w-5 h-5 text-sm1" />
              ) : (
                <BiDownArrow className="w-6 h-6 text-sm1" />
              )}
            </div>
          </div>
        )}

        {isOpen && (
          <div className="bg-gradient-to-br from-sm7 via-sm3 to-sm6 py-2 2xl:w-[8%] w-[14%] h-24 rounded-md absolute top-[81px] right-2 2xl:right-1">
            <div className="px-2 mt-2">
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={toProfile}
              >
                <BsFillPersonFill className="w-5 h-5 text-sm1" />
                <p className="text-sm 2xl:text-base text-sm1 font-satisfy tracking-widest">
                  Profile
                </p>
              </div>
              <hr className="border border-sm5 m-2" />
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={handleLogout}
              >
                <BiLogOutCircle className="w-5 h-5 text-sm1" />
                <p className="text-xs 2xl:text-sm text-sm1  font-satisfy tracking-widest">
                  Logout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
