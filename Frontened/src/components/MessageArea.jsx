import { IoIosArrowRoundBack } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import dp from "../assets/dp1.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerFill } from "react-icons/ri";
import { RiSendPlane2Fill } from "react-icons/ri";
import { ImImages } from "react-icons/im";
import { useRef, useState, useEffect } from "react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

export default function MessageArea() {
    const { selectedUser, userData, socket } = useSelector(
        (state) => state.user
    );
    const { messages } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    const [showPicker, setShowPicker] = useState(false);
    const [input, setInput] = useState("");
    const [fontenedImage, setFrontenedImage] = useState(null);
    const [backenedImage, setBackenedImage] = useState(null);

    const image = useRef(null);
    const bottomRef = useRef(null);

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setBackenedImage(file);
        setFrontenedImage(URL.createObjectURL(file));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (input.length == 0 && backenedImage == null) {
            return
        }

        try {
            const formData = new FormData();

            formData.append("message", input);

            if (backenedImage) {
                formData.append("image", backenedImage);
            }

            const result = await axios.post(
                `${serverUrl}/api/message/send/${selectedUser._id}`,
                formData,
                { withCredentials: true }
            );

            dispatch(
                setMessages([...messages, result.data.newMessage])
            );

            setInput("");
            setFrontenedImage(null);
            setBackenedImage(null);
        } catch (error) {
            console.log(error);
        }
    };

    const onEmojiClick = (emojiData) => {
        setInput((prev) => prev + emojiData.emoji);
        setShowPicker(false);
    };

    // Receive realtime messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (mess) => {
            dispatch(setMessages([...messages, mess]));
        };

        socket.on("newMessage", handleMessage);

        return () => {
            socket.off("newMessage", handleMessage);
        };
    }, [socket, messages, dispatch]);

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div
            className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"
                } lg:flex relative w-full h-full bg-slate-200 border-l-2 border-gray-300`}
        >
            {selectedUser && (
                <div className="w-full h-screen flex flex-col">
                    {/* Header */}
                    <div className="w-full h-25 bg-[#117798] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-5 gap-5">
                        <div className="cursor-pointer">
                            <IoIosArrowRoundBack
                                className="w-10 h-10 text-white"
                                onClick={() =>
                                    dispatch(setSelectedUser(null))
                                }
                            />
                        </div>

                        <div className="w-12 h-12 overflow-hidden rounded-full flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer">
                            <img
                                src={selectedUser?.image || dp}
                                alt="dp"
                                className="h-full"
                            />
                        </div>

                        <h1 className="text-white font-semibold text-[20px]">
                            {selectedUser?.name || "user"}
                        </h1>
                    </div>

                    {/* Messages */}
                    <div className="w-full flex-1 flex flex-col py-8 px-5 pb-35 scrollbar-hide overflow-y-auto">
                        {showPicker && (
                            <div className="absolute bottom-27 left-5">
                                <EmojiPicker
                                    width={250}
                                    height={350}
                                    className="shadow-lg"
                                    onEmojiClick={onEmojiClick}
                                />
                            </div>
                        )}

                        {messages &&
                            messages.map((message) =>
                                message.sender === userData.user._id ? (
                                    <SenderMessage
                                        key={message._id}
                                        image={message.image}
                                        message={message.message}
                                    />
                                ) : (
                                    <ReceiverMessage
                                        key={message._id}
                                        image={message.image}
                                        message={message.message}
                                    />
                                )
                            )}

                        {/* Scroll Target */}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
            )}

            {!selectedUser && (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="text-gray-700 font-bold text-[50px]">
                        Welcome to Chatly
                    </h1>
                    <span className="text-gray-700 font-semibold text-[30px]">
                        Chat Friendly !
                    </span>
                </div>
            )}

            {selectedUser && (
                <div className="w-full lg:w-[70%] h-25 fixed bottom-5 flex justify-center items-center">
                    {fontenedImage && (
                        <img
                            src={fontenedImage}
                            className="w-20 h-20 object-cover absolute bottom-22 right-[20%] rounded-lg shadow-gray-400 shadow-lg"
                        />
                    )}

                    <form
                        className="w-[95%] lg:w-[70%] bg-[#117798] h-15 rounded-full shadow-gray-400 shadow-lg flex items-center gap-5 px-5"
                        onSubmit={handleSendMessage}
                    >
                        <div>
                            <RiEmojiStickerFill
                                className="w-7 h-7 text-white cursor-pointer"
                                onClick={() =>
                                    setShowPicker((prev) => !prev)
                                }
                            />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            ref={image}
                            hidden
                            onChange={handleImage}
                        />

                        <input
                            type="text"
                            className="bg-transparent text-white w-full h-full px-3 outline-none border-0 text-[19px] placeholder-white"
                            placeholder="Enter Message"
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            value={input}
                        />

                        <div onClick={() => image.current.click()}>
                            <ImImages className="w-7 h-7 text-white cursor-pointer" />
                        </div>
                        {(input.length > 0 || backenedImage != null) && (
                            <button type="submit">
                                <RiSendPlane2Fill className="w-7 h-7 text-white cursor-pointer" />
                            </button>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}