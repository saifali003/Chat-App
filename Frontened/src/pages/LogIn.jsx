import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";
export default function LogIn(){
    const navigate = useNavigate();
    const [show, setShow] = useState(false)

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/login`,{
              email,password
            }, {withCredentials:true})
           dispatch(setUserData(result.data))
           dispatch(setSelectedUser(null))
           navigate("/")
            setEmail("");
            setPassword("");
            setLoading(false);
            setError("");
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error.response?.data?.message || error.message);
        }
    }
    return(
        <div className="w-full h-screen bg-slate-200 flex justify-center items-center">
            <div className="w-full max-w-125 h-120 bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-7.5">
                <div className="w-full h-40 bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
                   <h1 className="text-gray-600 font-bold text-[30px]">Login to <span className="text-white">Chatly</span></h1>
                </div>
                 <form className="w-full flex flex-col gap-5 items-center" onSubmit={handleLogin}>
                   
                   <input 
                   type="text" 
                   placeholder="Enter E-mail" 
                   className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-5 py-2.5 bg-white rounded-lg shadow-gray-400 shadow-lg"
                   onChange={(e)=>setEmail(e.target.value)}
                   value={email}
                   />

                   <div className="w-[90%] h-12 border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-400 shadow-lg relative">

                    <input 
                    type={`${show? "text":"password"}`} 
                    placeholder="Enter Password" 
                    className="w-full h-full outline-none px-5 py-2.5 bg-white"
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                    />
                    <span className="absolute top-2 right-4 text-[19px] text-[#20c7ff] font-semibold cursor-pointer" onClick={()=> setShow(prev=> !prev)}>{`${show? "hidden":"show"}`}</span>
                   </div>
                     
                     {error && <p className="text-red-500">{error}</p>}

                   <button 
                   className="px-5 py-2.5 bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-50 cursor-pointer font-semibold hover:shadow-inner"
                   disabled={loading}
                   >{loading? "loading..." : "Login"}</button>
                   <p className="cursor-pointer" onClick={()=>navigate("/signup")}>Want to Create a New Account ? <span className="text-[#20c7ff] font-bold">Signup</span></p>
            </form>
            </div>
        </div>
    )
}