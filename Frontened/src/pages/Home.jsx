import MessageArea from "../components/MessageArea";
import SideBar from "../components/SideBar";
import useGetMessages from "../customHooks/getMessages";

export default function Home(){
    useGetMessages()
    return (
        <div className="w-full h-screen flex overflow-hidden">
           <SideBar/>
           <MessageArea/>
        </div>
    )
}