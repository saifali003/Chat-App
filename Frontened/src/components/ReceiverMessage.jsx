import { useRef } from "react";
import dp from "../assets/dp1.png";
import { useSelector } from "react-redux";

export default function ReceiverMessage({ image, message }) {
  const scroll = useRef();

  const handleImageScroll = () => {
    scroll?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { selectedUser } = useSelector((state) => state.user);

  return (
    <div className="w-full flex justify-start items-start gap-2 mb-3" ref={scroll}>
      
      <div className="w-10 h-10 overflow-hidden rounded-full flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer shrink-0">
        <img
          src={selectedUser?.image || dp}
          alt="dp"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-fit max-w-125 bg-[#20c7ff] px-5 py-3 text-white text-[19px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-gray-400 shadow-lg mt-5">
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

    </div>
  );
}