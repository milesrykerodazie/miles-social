import Layout from "../../components/layout/Layout";
import { baseAPI, USER_DETAILS } from "../../components/constants/Constant";
import Image from "next/image";
import { AiFillEdit } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { Country, State, City } from "country-state-city";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import Resizer from "react-image-file-resizer";

const EditUserProfile = ({ userData }) => {
  // router
  const router = useRouter();

  //relationship array
  const relationship = [
    {
      id: 1,
      value: "Single",
    },
    {
      id: 2,
      value: "In a relationship",
    },
    {
      id: 3,
      value: "Engaged",
    },
    {
      id: 4,
      value: "Married",
    },
    {
      id: 5,
      value: "Divorced",
    },
    {
      id: 6,
      value: "Separated",
    },
    {
      id: 7,
      value: "Complicated",
    },
    {
      id: 8,
      value: "I dont know",
    },
    {
      id: 9,
      value: "In an open relationship",
    },
    {
      id: 10,
      value: "In a domestic partnership",
    },
  ];

  //states for the post
  const [firstName, setFirstName] = useState(userData?.user.firstName);
  const [lastName, setLastName] = useState(userData?.user.lastName);
  const [username, setUsername] = useState(userData?.user.username);
  const [description, setDescription] = useState(userData?.user.description);

  //states for count
  const [count, setCount] = useState(0);
  const maxText = 250;

  //handle change
  const handleChange = (e) => {
    e.preventDefault();
    setCount(e.target.value.length);
    setDescription(e.target.value);
  };

  const countRemaining = maxText - count;

  //state to open dropdowns
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openRelationship, setOpenRelationship] = useState(false);

  //country state city starts here
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [countryCode, setCountryCode] = useState(userData?.user?.country_code);
  const [stateCode, setStateCode] = useState(userData?.user?.state_code);

  const [countryName, setCountryName] = useState(userData?.user?.country);
  const [stateName, setStateName] = useState(userData?.user?.state);
  const [cityName, setCityName] = useState(userData?.user?.city);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // setting the states
  useEffect(() => {
    setStates(State.getAllStates());
  }, []);

  //setting the cities
  useEffect(() => {
    setCities(City.getAllCities());
  }, []);

  //filtering states by countryCode
  useEffect(() => {
    setFilteredStates(
      states.filter((state) => state.countryCode === countryCode)
    );
  }, [countryCode, states]);

  //filtering cities by stateCode
  useEffect(() => {
    setFilteredCities(cities.filter((city) => city.stateCode === stateCode));
  }, [stateCode]);

  //relationship state
  const [relationshipState, setRelationshipState] = useState(
    userData?.user?.relationships
  );

  //state for submit process in progress
  const [processing, setProcessing] = useState(false);

  //state for image
  const [userProfilePic, setUserProfilePic] = useState(
    userData?.user?.profilePicture
  );
  const [userCoverPic, setUserCoverPic] = useState(
    userData?.user?.coverPicture
  );

  //image resize
  const resizeFile = (file, width, height) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleCoverPicture = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      const imageResized = await resizeFile(file, 400, 400);
      setUserCoverPic(imageResized);
    } catch (error) {
      console.log(error);
    }
  };

  //handle coverPicture upload
  const handleUserPicture = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      const imageResized = await resizeFile(file, 100, 100);
      setUserProfilePic(imageResized);
    } catch (error) {
      console.log(error);
    }
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      firstName === undefined ||
      lastName === undefined ||
      username === undefined
    ) {
      toast.error("Primary fields can not be empty!!");
    }
    try {
      setProcessing(true);
      await axios.put(`${baseAPI}/update/${userData?.user?._id}`, {
        userId: userData?.user._id,
        firstName,
        lastName,
        username,
        description,
        country_code: countryCode,
        state_code: stateCode,
        country: countryName,
        state: stateName,
        city: cityName,
        profilePicture: userProfilePic,
        coverPicture: userCoverPic,
        relationships: relationshipState,
      });
      setProcessing(false);
      toast.success("Profile updated successfully!!");

      router.push(`/profile/${userData.user.username}`);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className=" lg:px-4 py-2">
      <Head>
        <title>Edit-Profile</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="shadow-xl shadow-sm2 rounded-md w-full min-h-[calc(100vh-120px)]">
        <h3 className="text-center text-sm1 text-lg font-charm font-bold tracking-wider">
          Edit Profile
        </h3>
        <div className="px-2 lg:px-3 pt-2 ">
          <div className="flex flex-col space-y-2 lg:space-y-3">
            <div className="relative w-full h-24 lg:h-32 ">
              <Image
                src={
                  userCoverPic
                    ? userCoverPic
                    : "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                }
                alt="cover-pic"
                layout="fill"
                className="rounded-lg object-cover"
              />
              <div className="absolute top-0 right-0">
                <label
                  htmlFor="coverfile"
                  className="flex items-center space-x-2 bg-sm5 px-3 py-1 rounded-bl-lg cursor-pointer"
                >
                  <p className="text-sm1 font-charm text-sm lg:text-base tracking-wider font-semibold">
                    Change
                  </p>
                  <AiFillEdit className="text-sm1 cursor-pointer w-3 h-3 lg:w-4 lg:h-4" />
                </label>
              </div>
              {/* image input  */}
              <input
                hidden
                type="file"
                id="coverfile"
                name="image"
                accept=".png,.jpeg,.jpg"
                onChange={handleCoverPicture}
              />
            </div>
            <div className="justify-center items-center flex">
              <div className="relative w-20 h-20">
                <Image
                  src={
                    userProfilePic
                      ? userProfilePic
                      : "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                  }
                  alt="cover-pic"
                  layout="fill"
                  className="rounded-full object-cover"
                />
                <div className="absolute bottom-5 left-0">
                  <label
                    htmlFor="picfile"
                    className="flex items-center space-x-2 bg-sm5/40 px-2 py-1 rounded-bl-xl rounded-br-xl"
                  >
                    <p className="text-sm1 font-charm text-sm tracking-wider font-semibold">
                      Change
                    </p>
                    <AiFillEdit className="text-sm1 cursor-pointer w-3 h-3 lg:w-4 lg:h-4" />
                  </label>
                </div>
                <input
                  hidden
                  type="file"
                  id="picfile"
                  name="image"
                  accept=".png,.jpeg,.jpg"
                  onChange={handleUserPicture}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <form className="space-y-5 lg:space-y-7" onSubmit={handleSubmit}>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="form-input"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="form-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="form-input"
                />
                <div className="text-white relative">
                  <label className="label">Relationship Status</label>
                  <div className="select">
                    <p className="p">
                      {relationshipState === undefined
                        ? "Select Status"
                        : relationshipState}
                    </p>
                    {!openRelationship ? (
                      <MdKeyboardArrowRight
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenRelationship(!openRelationship)}
                      />
                    ) : (
                      <MdOutlineKeyboardArrowDown
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenRelationship(!openRelationship)}
                      />
                    )}
                  </div>
                  {/* select relationship status */}
                  {openRelationship && (
                    <div className="dropdown">
                      {relationship?.map(({ id, value }) => (
                        <h1
                          key={id}
                          className=" list"
                          onClick={() => {
                            setRelationshipState(value);
                            setOpenRelationship(!openRelationship);
                          }}
                        >
                          <span className="names">{value}</span>
                        </h1>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-3">
                {/*select country */}
                <div className="relative">
                  <label className="label">Country</label>
                  <div className="select">
                    <p className="p">
                      {countryName === undefined
                        ? "Select Country"
                        : countryName}
                    </p>
                    {!openCountry ? (
                      <MdKeyboardArrowRight
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenCountry(!openCountry)}
                      />
                    ) : (
                      <MdOutlineKeyboardArrowDown
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenCountry(!openCountry)}
                      />
                    )}
                  </div>
                  {/* the list of countries */}
                  {openCountry && (
                    <div className="dropdown">
                      {countries?.map((option) => (
                        <h1
                          key={option.isoCode}
                          className=" list"
                          onClick={() => {
                            setCountryName(option.name);
                            setCountryCode(option.isoCode);
                            setOpenCountry(!openCountry);
                          }}
                        >
                          <span className="names">{option.name}</span>
                        </h1>
                      ))}
                    </div>
                  )}
                </div>
                {/* select state */}
                <div className="relative">
                  <label className="label">State</label>
                  <div className="select">
                    <p className="p truncate">
                      {stateName === undefined ? "Select State" : stateName}
                    </p>
                    {!openState ? (
                      <MdKeyboardArrowRight
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenState(!openState)}
                      />
                    ) : (
                      <MdOutlineKeyboardArrowDown
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenState(!openState)}
                      />
                    )}
                  </div>
                  {/* the list of states */}
                  {filteredStates?.length !== 0 && (
                    <>
                      {openState && (
                        <div className="dropdown">
                          {filteredStates?.map((option) => (
                            <h1
                              key={option.isoCode}
                              className=" list"
                              onClick={() => {
                                setStateName(option.name);
                                setStateCode(option.isoCode);
                                setOpenState(!openState);
                              }}
                            >
                              <span className="names">{option.name}</span>
                            </h1>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* select city */}
                <div className="relative">
                  <label className="label">City</label>
                  <div className="select">
                    <p className="p">
                      {cityName === undefined ? "Select City" : cityName}
                    </p>
                    {!openCity ? (
                      <MdKeyboardArrowRight
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenCity(!openCity)}
                      />
                    ) : (
                      <MdOutlineKeyboardArrowDown
                        className="w-4 h-4 lg:w-6 lg:h-6 text-sm1 "
                        onClick={() => setOpenCity(!openCity)}
                      />
                    )}
                  </div>
                  {/* the list of states */}
                  {filteredCities?.length !== 0 && (
                    <>
                      {openCity && (
                        <div className="dropdown">
                          {filteredCities?.map((option, index) => (
                            <h1
                              key={index}
                              className=" list"
                              onClick={() => {
                                setCityName(option.name);

                                setOpenCity(!openCity);
                              }}
                            >
                              <span className="names">{option.name}</span>
                            </h1>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div>
                <textarea
                  type="text"
                  value={description}
                  placeholder="Bio"
                  rows="3"
                  maxLength="250"
                  className="textarea"
                  onChange={handleChange}
                />
                {/* condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2 */}
                <p
                  className={`text-right text-sm1 font-charm font-semibold tracking-wide text-sm  ${
                    countRemaining <= 30 ? "text-yellow-500" : ""
                  } ${countRemaining <= 10 ? "text-red-500" : ""}`}
                >
                  {countRemaining}/{maxText}
                </p>
              </div>
              {processing ? (
                <button className="flex items-center space-x-1 shadow-md shadow-sm1 px-3 py-1">
                  <p className="animate-slowpulse text-lg text-sm1">
                    Updating...
                  </p>
                  <ImSpinner3 className="w-6 h-6 animate-spin" />
                </button>
              ) : (
                <div className="flex items-center space-x-6">
                  <p
                    className="text-sm1 shadow-md shadow-sm1 px-3 py-1 cursor-pointer"
                    onClick={() =>
                      router.push(`/profile/${userData.user.username}`)
                    }
                  >
                    Cancel
                  </p>
                  <button
                    type="submit"
                    className="text-sm1 shadow-md shadow-sm1 px-3 py-1"
                  >
                    Update
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EditUserProfile.Layout = Layout;
export default EditUserProfile;

//server side rendering

export async function getServerSideProps(context) {
  const { username } = context.query;
  const res = await fetch(`${USER_DETAILS}/${username}`);
  const data = await res.json();

  return {
    props: {
      userData: data,
    },
  };
}
