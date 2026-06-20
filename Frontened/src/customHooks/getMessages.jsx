import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (!selectedUser?._id) {
            dispatch(setMessages([]));
            return;
        }

        const fetchMessages = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    { withCredentials: true }
                );
                dispatch(setMessages(result.data.messages || []));
            } catch (error) {
                console.log(error.response?.data || error.message);
                dispatch(setMessages([]));
            }
        };

        fetchMessages();
    }, [selectedUser, dispatch]);
};

export default useGetMessages;