import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
        sender : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true
        },
        receiver : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true
        },
        message : {
            type : String,
            default : ""
        },
        image : {
            type : String,
            default : ""
        }
},{timestamps:true})

const messageModel = mongoose.model("message",messageSchema);
export default messageModel;