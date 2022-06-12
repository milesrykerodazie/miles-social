import { BiDotsVerticalRounded } from "react-icons/bi";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-12 h-12 bg-sm2/20 rounded-full" />
          <p className="w-1/2 bg-sm2/20 rounded-md py-2" />
        </div>
        <p className="mr-3">
          <BiDotsVerticalRounded className="w-6 h-6 text-sm2/20" />
        </p>
      </div>

      <p className="w-40 bg-sm2/20 rounded-md py-2" />
      <div className="h-56 bg-sm2/20 rounded w-full" />
      <div className="flex justify-between items-center">
        <p className="w-6 h-6 bg-sm2/20 rounded-full" />
        <p className="w-20 bg-sm2/20 rounded-md py-1" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
