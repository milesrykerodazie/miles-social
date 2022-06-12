import { useState } from "react";

const ReadMoreReadLess = ({
  children,
  textSize,
  smallTextSize,
  limit,
  font,
  textColor,
  fontWeight,
  textTransform,
}) => {
  // handling the read more and read less state
  const [readMore, setReadMore] = useState(false);

  //checking if there is text or not
  if (!children) {
    return;
  }
  return (
    <div className="">
      <p
        className={`text-sm7 text-justify font-${fontWeight} text-${smallTextSize} 2xl:text-${textSize} text-${textColor} font-${font}`}
      >
        {readMore ? children : children.substr(0, limit)}
      </p>

      <div
        className={`flex justify-end ${
          children.length <= limit ? "" : "-mt-5"
        }`}
      >
        <button
          className="mr-5 2xl:text-base text-sm"
          onClick={() => setReadMore(!readMore)}
        >
          {/* condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2 */}
          {children.length <= limit
            ? ""
            : readMore
            ? "collapse"
            : "...read More"}
        </button>
      </div>
    </div>
  );
};

export default ReadMoreReadLess;
