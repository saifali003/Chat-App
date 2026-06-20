import { useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp1.png";

export default function SenderMessage({ image, message }) {
  const scroll = useRef();
  const { userData } = useSelector((state) => state.user);

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full flex justify-end items-start gap-2 mb-3" ref={scroll}>
      
      <div className="w-fit max-w-125 bg-green-500 px-5 py-3 text-white text-[19px] rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-gray-400 shadow-lg mt-3">
        {image && (
          <img
            src={image}
            className="w-25 rounded-lg mb-2"
            onLoad={handleImageScroll}
            alt="message"
          />
        )}
        {message && <span>{message}</span>}
      </div>

      <div className="w-10 h-10 overflow-hidden rounded-full flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer shrink-0">
        <img
          src={userData?.user?.image || dp}
          alt="dp"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}