import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../public/assets/social-logo2.png";
import { BsSearch, BsFillPersonFill } from "react-icons/bs";
import { SiGooglemessages } from "react-icons/si";
import { MdNotifications } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/router";
import MobileLeftside from "./MobileLeftside";
import { BiDownArrow, BiUpArrow, BiLogOutCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { setLogOut } from "../redux/features/authSlice";
import { persistor } from "../redux/store";

const MobileHeader = () => {
  //getting the logged in user from redux using useSelector
  const { user } = useSelector((state) => ({ ...state.auth }));
  const id = user?.user?._id;
  //getting the username from user details for easier use
  const username = user?.user.username;
  const userPicture = user?.user.profilePicture;
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [nav, setNav] = useState(false);

  const [pageScroll, setPageScroll] = useState(false);

  //useEffect for page scroll
  useEffect(() => {
    const scrl = window.addEventListener("scroll", () =>
      setPageScroll(window.scrollY > 90)
    );
    return scrl;
  }, [pageScroll]);

  //handle nav
  const handleNav = () => {
    setNav(!nav);
    setIsOpen(false);
    setSearchOpen(false);
  };

  //handling search open
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
    setIsOpen(false);
  };

  //dispatch
  const dispatch = useDispatch();

  //router navigation
  const router = useRouter();

  // handle is open
  const handleOpen = () => {
    setIsOpen(!isOpen);
    setSearchOpen(false);
  };

  //toProfile
  const toProfile = () => {
    router.push(`/profile/${username}`);
    setIsOpen(false);
  };

  //toMessage
  const toMessage = () => {
    router.push(`/messenger/${id}`);
    setIsOpen(false);
  };

  //handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(setLogOut(user));
    persistor.purge(user);
    router.push("/login");
    setIsOpen(false);
  };
  return (
    <div>
      <div
        className={`bg-sm4 flex items-center justify-between fixed top-0 w-full h-16 z-50 px-2 md:pt-2 duration-400 ease-in ${
          pageScroll && "shadow-md shadow-sm4"
        }`}
      >
        <div className="flex items-center space-x-1 md:space-x-2 ">
          <div className="relative w-12 h-12">
            <Image
              src={logo}
              alt="logo"
              layout="fill"
              className="animate-pulse"
            />
          </div>

          <div
            className="bg-sm1 md:w-10 md:h-10 w-6 h-6 rounded-full flex items-center justify-center relative"
            onClick={handleSearch}
          >
            <BsSearch className="md:w-6 md:h-6 w-4 h-4" />
            {searchOpen && (
              <p className="bg-sm6 w-4 h-4 md:w-5 md:h-5 items-center justify-center flex rounded-full absolute left-3 -top-2 md:-top-1 md:left-7">
                <span className=" text-xs md:text-sm text-sm1 font-semibold">
                  x
                </span>
              </p>
            )}
          </div>
          {searchOpen && (
            <div className="bg-sm4 absolute mt-20 left-4 sm:left-10 md:left-24 w-[90%] mx-auto text-white flex items-center space-x-2 z-40 border px-3 rounded-lg border-sm2">
              <input
                type="text"
                placeholder="Search here"
                className="bg-transparent w-full outline-none py-3 text-sm md:text-lg text-sm1 placeholder:text-base placeholder:text-sm1 placeholder:font-satisfy placeholder:tracking-widest"
              />
              <button className="bg-sm2 px-3 py-1 rounded-md text-sm font-satisfy tracking-widest text-sm7">
                Search
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 md:space-x-5">
          <AiFillHome
            className="md:w-10 md:h-10 w-7 h-7 text-sm7"
            onClick={() => router.push("/")}
          />
          <div className="relative">
            <BsFillPersonFill className="md:w-10 md:h-10 w-7 h-7 text-sm7" />
            <p className="bg-sm2 md:h-5 md:w-5 h-4 w-4 flex items-center justify-center rounded-full absolute md:-top-2 md:left-6 -top-1 left-3">
              <span className="text-white text-[10px] text-center ">1</span>
            </p>
          </div>
          <div className="relative" onClick={toMessage}>
            <SiGooglemessages className="md:w-10 md:h-10 w-7 h-7 text-sm7" />
            <p className="bg-sm2 md:h-5 md:w-5 h-4 w-4 flex items-center justify-center rounded-full absolute md:-top-2 md:left-6 -top-1 left-4">
              <span className="text-white text-[10px] text-center ">3</span>
            </p>
          </div>
          <div className="relative">
            <MdNotifications className="md:w-10 md:h-10 w-7 h-7 text-sm7" />
            <p className="bg-sm2 md:h-5 md:w-5 h-4 w-4 flex items-center justify-center rounded-full absolute md:-top-2 md:left-6 -top-1 left-4">
              <span className="text-white text-[10px] text-center ">20</span>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <GiHamburgerMenu
            className="w-8 h-8 mr-3 text-sm7"
            onClick={handleNav}
          />
          <div
            className="flex flex-col items-center md:mr-3 -mt-1 md:-mt-3"
            onClick={handleOpen}
          >
            <div className="relative w-10 h-10 cursor-pointer">
              <Image
                src={
                  userPicture
                    ? userPicture
                    : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
                }
                alt="logo"
                layout="fill"
                className="rounded-full"
              />
            </div>
            <div className="absolute mt-8 ">
              {isOpen ? (
                <BiUpArrow className="w-6 h-6 text-sm1" />
              ) : (
                <BiDownArrow className="w-6 h-6 text-sm1" />
              )}
            </div>
          </div>
          {isOpen && (
            <div className="bg-gradient-to-br from-sm5 via-sm3 to-sm4 py-2 md:w-[24%] w-[28%] h-24 rounded-md absolute top-[64px] right-2 md:right-1">
              <div className="px-1 md:px-2 mt-2">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={toProfile}
                >
                  <BsFillPersonFill className="w-5 h-5 text-sm1" />
                  <p className=" text-sm text-sm7 font-semibold font-satisfy tracking-widest">
                    Profile
                  </p>
                </div>
                <hr className="border border-sm5 m-3" />
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={handleLogout}
                >
                  <BiLogOutCircle className="w-5 h-5 text-sm1" />
                  <p className="text-sm text-sm7 font-semibold font-satisfy tracking-widest">
                    Logout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* mobile nav section */}
      <MobileLeftside nav={nav} setNav={setNav} />
    </div>
  );
};

export default MobileHeader;
