import Image from "next/image";
import { MdPermMedia, MdLocationPin } from "react-icons/md";
import { AiFillTag, AiFillCloseCircle } from "react-icons/ai";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { baseAPI } from "../constants/Constant";
import { toast } from "react-toastify";
import { ImSpinner3 } from "react-icons/im";
import Resizer from "react-image-file-resizer";

const UserFeedTop = ({ userDetails }) => {
  //getting the logged in user from redux using useSelector hook
  const { user } = useSelector((state) => ({ ...state.auth }));

  //states for the post

  const [image, setImage] = useState("");
  const postDescription = useRef("");
  const [processing, setProcessing] = useState(false);

  //router
  const router = useRouter();

  //handle image upload

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleImage = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      const imageResized = await resizeFile(file);
      setImage(imageResized);
    } catch (error) {
      console.log(error);
    }
  };

  // handle submit post
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (postDescription.current.value === "" || image === "") {
      toast.error("Post can not be empty");
      return;
    }
    const newPost = {
      userId: user?.user._id,
      description: postDescription.current.value,
      img: image,
    };
    try {
      setProcessing(true);
      await axios.post(`${baseAPI}/create`, newPost);
      postDescription.current.value = "";
      setImage("");
      toast.success("Post successful!!");
      router.reload();
      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // if (user?.user._id !== userDetails?._id) {
  //   return;
  // }

  return (
    <div className="bg-sm1 h-auto rounded-lg shadow-md shadow-sm2/70 px-2 py-3 mb-2">
      <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10 2xl:w-12 2xl:h-12">
          <Image
            src={
              userDetails?.profilePicture
                ? userDetails?.profilePicture
                : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
            }
            alt="logo"
            layout="fill"
            className="rounded-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          ref={postDescription}
          placeholder={`Whats on your mind ${userDetails?.firstName}?`}
          className="w-4/5 p-3 bg-transparent placeholder:text-sm7/60 placeholder:text-base 2xl:placeholder:text-lg placeholder:font-quicksand placeholder:tracking-wider text-sm 2xl:text-lg font-quicksand text-sm7 tracking-wider outline-none"
        />
      </div>
      <hr className="m-5 border 2xl:border-2 border-sm5" />
      <div className="mx-5 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <label
            htmlFor="file"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <MdPermMedia className="md:w-7 md:h-7 w-5 h-5 text-sm4" />
            <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7 hidden xl:inline-flex">
              Photo or Video
            </p>
          </label>
          <input
            disabled={processing}
            hidden
            type="file"
            id="file"
            name="upload-file"
            onChange={handleImage}
          />
          <div className="flex items-center space-x-2 cursor-pointer">
            <AiFillTag className="md:w-7 md:h-7 w-5 h-5 text-sm4" />
            <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7 hidden xl:inline-flex">
              Tag
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdLocationPin className="md:w-7 md:h-7 w-5 h-5 text-sm4" />
            <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7 hidden xl:inline-flex">
              Location
            </p>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <BsFillEmojiSmileFill className="md:w-7 md:h-7 w-5 h-5 text-sm4" />
            <p className="text-base 2xl:text-xl font-rancho tracking-wider text-sm7 hidden xl:inline-flex">
              Mood
            </p>
          </div>
        </div>
        {processing === true ? (
          <div className="flex items-center space-x-1">
            <p className="animate-slowpulse text-lg text-sm7">Posting...</p>
            <ImSpinner3 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <button
            className="bg-sm4 text-sm7 px-5 lg:px-4 py-2 lg:py-1 text-base 2xl:text-lg font-quicksand tracking-wider font-semibold rounded-md cursor-pointer"
            onClick={handlePostSubmit}
          >
            Share
          </button>
        )}
      </div>
      {image && (
        <div className="mt-5 flex justify-center">
          <div className="relative w-[60%] h-44  2xl:h-52">
            <Image
              src={image}
              alt="logo"
              layout="fill"
              className="rounded-md object-cover"
            />
          </div>
          <div className="-ml-3 -mt-2 z-40" onClick={() => setImage("")}>
            <AiFillCloseCircle className="w-6 h-6 text-sm7" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeedTop;
