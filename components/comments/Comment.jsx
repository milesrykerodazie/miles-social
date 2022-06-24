import Image from "next/image";
import { format } from "timeago.js";
import { MdDelete } from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";
import { useSelector } from "react-redux";
import { baseAPI } from "../constants/Constant";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const Comment = ({ comment, forceUpdate }) => {
  // getting the logged in user
  const { user } = useSelector((state) => ({ ...state.auth }));

  //state for open delete
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // handle open delete
  const handleConfirmDelete = (e) => {
    e.preventDefault();
    setOpenDelete(false);
    setConfirmDelete(true);
  };

  //handle delete comment
  const handleDeleteComment = async (e) => {
    e.preventDefault();
    if (comment?.sender !== user?.user._id) {
      toast.error("You can only delete your own comments");
      return;
    }
    try {
      setDeleting(true);
      await axios.delete(`${baseAPI}/deletecomment/${comment?._id}`);
      setDeleting(false);
      toast.success("Comment deleted");
      forceUpdate();
    } catch (error) {
      toast.error(error?.response?.data.message);
      console.log(error?.response?.data.message);
    }
  };
  return (
    <div className="flex justify-between">
      <div className="flex space-x-2">
        <div>
          <div className="relative w-4 h-4 lg:w-6 lg:h-6">
            <Image
              priority
              src={
                comment?.senderPic
                  ? comment?.senderPic
                  : "https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg"
              }
              alt="senderPic"
              layout="fill"
              className="rounded-full cursor-pointer object-cover"
            />
          </div>
        </div>
        <p className="font-quicksand text-sm lg:text-base text-sm7 text-justify max-w-[400px]">
          {comment?.comment}
        </p>
        <p className="text-xs mt-1 text-sm4">{format(comment?.createdAt)}</p>
      </div>
      {user?.user._id === comment?.sender && (
        <div className="relative">
          {deleting === false && (
            <button
              className="rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-md shadow-sm7 p-1 -mt-1"
              onClick={() => setOpenDelete(!openDelete)}
            >
              <MdDelete className="text-sm7" />
            </button>
          )}

          {openDelete && (
            <div
              className="shadow-lg shadow-sm7 px-2 py-1 absolute top-7 right-0 rounded-md cursor-pointer"
              onClick={handleConfirmDelete}
            >
              <p className="font-quicksand text-xs lg:text-sm">Delete</p>
            </div>
          )}
          {deleting === true ? (
            <div className="flex items-center space-x-1">
              <p className="animate-slowpulse text-xs lg:text-sm text-sm7">
                Deleting...
              </p>
              <ImSpinner3 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div>
              {confirmDelete && (
                <div className="shadow-lg shadow-sm7 px-2 py-1 absolute top-7 right-0 rounded-md">
                  <div className="text-sm lg:text-base font-quicksand flex items-center space-x-3">
                    <p
                      className="cursor-pointer border-b-2 border-sm6 text-xs lg:text-sm"
                      onClick={handleDeleteComment}
                    >
                      Confirm
                    </p>
                    <span>/</span>
                    <p
                      className="cursor-pointer text-sm7 font-bold text-xs lg:text-sm"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
