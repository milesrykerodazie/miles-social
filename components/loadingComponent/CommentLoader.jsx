import { MdDelete } from "react-icons/md";

const CommentLoader = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full">
          <div className="w-6 h-6 bg-sm2/20 rounded-full" />
          <p className="w-1/4 bg-sm2/20 rounded-md py-2" />
          <p className="w-1/4 bg-sm2/20 rounded-md py-2" />
        </div>
        <button className="rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center shadow-md shadow-sm2/20 p-1">
          <MdDelete className="text-sm2/20" />
        </button>
      </div>
    </div>
  );
};

export default CommentLoader;
