import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp1.png";
import { BiLogOutCircle } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user);
    const [search, setSearch] = useState(false);
    const [input, setInput] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true
            });

            dispatch(setUserData(null));
            dispatch(setOtherUsers(null));
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true });
            dispatch(setSearchData(result.data.users))
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (input) {
            handleSearch()
        }
    }, [input])

    return (
        <div
            className={`lg:w-[30%] w-full h-screen bg-slate-200 flex flex-col overflow-hidden ${!selectedUser ? "block" : "hidden"} lg:flex`}>
            <div
                className="w-15 h-15 overflow-hidden bg-[#20c7ff] rounded-full mt-3 flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer fixed bottom-5 left-2 z-50"
                onClick={handleLogOut}
            >
                <BiLogOutCircle className="w-7 h-7" />
            </div>


            {/* Header */}
            <div className="w-full h-60 bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-5 shrink-0">
                <h1 className="text-white font-semibold text-[25px]">
                    chatly
                </h1>

                <div className="w-full flex justify-between items-center">
                    <h1 className="text-gray-800 font-bold text-[25px]">
                        Hi, {userData?.user?.name || "user"}
                    </h1>

                    <div
                        className="w-15 h-15 overflow-hidden rounded-full flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src={userData?.user?.image || dp}
                            alt="dp"
                            className="h-full"
                        />
                    </div>
                </div>

                <div className="w-full flex items-center gap-5">
                    {!search && (
                        <div
                            className="w-15 h-15 overflow-hidden bg-white rounded-full mt-3 flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer"
                            onClick={() => setSearch(true)}
                        >
                            <IoIosSearch className="w-5 h-5" />
                        </div>
                    )}

                    {search && (
                        <form className="w-full h-15 bg-white shadow-gray-500 shadow-lg flex items-center gap-3 mt-3 rounded-full px-5 relative">
                            <IoIosSearch className="w-7 h-7" />

                            <input
                                type="text"
                                placeholder="search users..."
                                className="w-full h-full p-3 outline-0 border-0 text-[20px]"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                            />

                            <RxCross2
                                className="w-7 h-7 cursor-pointer"
                                onClick={() => setSearch(false)}
                            />


                        </form>
                    )}

                    {!search &&
                        otherUsers?.users?.map((user) => (
                            onlineUsers?.includes(user._id) && (
                                <div key={user._id} className="relative cursor-pointer" onClick={() => dispatch(setSelectedUser(user))}>
                                    <div
                                        className="w-15 h-15 overflow-hidden mt-5 rounded-full flex justify-center items-center shadow-gray-500 shadow-lg"
                                    >
                                        <img
                                            src={user.image || dp}
                                            alt="dp"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <span className="w-3 h-3 rounded-full bg-green-600 absolute bottom-0 right-0 border-2 border-white"></span>
                                </div>
                            )
                        ))}
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2 items-center mt-3 pb-5">

                {(input.trim() ? searchData : otherUsers?.users)?.map((user) => (
                    <div
                        key={user._id}
                        className="w-[95%] min-h-14 flex justify-start items-center gap-5 bg-white shadow-gray-500 shadow-lg rounded-full cursor-pointer hover:bg-[#a0a0d4]"
                        onClick={() => dispatch(setSelectedUser(user))}
                    >
                        <div className="w-12 h-12 overflow-hidden rounded-full flex justify-center items-center shadow-gray-500 shadow-lg">
                            <img
                                src={user.image || dp}
                                alt="dp"
                                className="h-full"
                            />
                        </div>

                        <h1 className="text-gray-800 font-semibold text-[20px]">
                            {user.name || user.userName}
                        </h1>
                    </div>
                ))}

            </div>
        </div>
    );
}