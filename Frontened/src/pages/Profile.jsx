import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp1.png"
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
export default function Profile(){
    const {userData} = useSelector(state=> state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name,setName] = useState(userData?.user?.name || "")
    const [frontenedImage,setFrontenedImage] = useState(userData?.user?.image || dp)
    const [backenedImage,setBackenedImage] = useState(null)
    const [saving,setSaving] = useState(false);
    const image = useRef()
    const handleImage = (e)=>{
        let file = e.target.files[0]
        setBackenedImage(file)
        setFrontenedImage(URL.createObjectURL(file))
    }

    const handleProfile = async(e)=>{
       e.preventDefault()
       setSaving(true)
       try {
        let formData = new FormData()
        formData.append("name",name)
        if(backenedImage){
            formData.append("image",backenedImage)
        }
        let result = await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
        setSaving(false)
        dispatch(setUserData(result.data))
        navigate("/")
       } catch (error) {
         console.log(error)
         setSaving(false)
       }
    }

    return(
        <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center gap-5">
            <div className="fixed top-5 left-5">
                <IoIosArrowRoundBack className="w-10 h-10 text-gray-600 cursor-pointer" onClick={()=>navigate("/")}/>
            </div>
            <div className=" bg-white border-2 rounded-full border-[#20c7ff] shadow-gray-400 shadow-lg relative" onClick={()=> image.current.click()}>
               <div className="w-50 h-50 overflow-hidden rounded-full flex justify-center items-center">
                <img src={frontenedImage} alt="dp" className="w-full"/>
               </div>
               <div className="absolute bottom-6 text-gray-700 right-4 w-8 h-8 rounded-full bg-[#20c7ff] flex justify-center items-center shadow-gray-400 shadow-lg">
                <IoCameraOutline className="text-gray-700 w-6 h-6"/>
               </div>
            </div>
            <form className="w-[95%] max-w-125 flex flex-col gap-5 items-center justify-center" onSubmit={handleProfile}>

                <input
                 type="file"
                 accept="image/*"
                 ref={image}
                 hidden
                 onChange={handleImage}
                />

                <input 
                type="text" 
                placeholder="Enter your Name"
                className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-5 py-2.5 bg-white rounded-lg shadow-gray-400 shadow-lg"
                onChange={(e)=> setName(e.target.value)}
                value={name}
                />

                <input 
                type="text" 
                readOnly 
                className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-5 py-2.5 bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-400"
                value={userData?.user?.userName || ""}
                />

                <input 
                type="email" 
                readOnly 
                className="w-[90%] h-12 outline-none border-2 border-[#20c7ff] px-5 py-2.5 bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-400"
                value={userData?.user?.email || ""}
                />
                <button
                 className="px-5 py-2.5 bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-50 cursor-pointer font-semibold hover:shadow-inner"
                 disabled={saving}
                 >
                    {saving?"Saving..." : "Save Profile"}
                 </button>
            </form>
        </div>
    )
}