import uploadOnCloudinary from "../config/cloudinary.js";
import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;
        const { message } = req.body;

        let image = "";

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let conversation = await conversationModel.findOne({
            participants: { $all: [sender, receiver] }
        });

        const newMessage = await messageModel.create({
            sender,
            receiver,
            message,
            image
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const receiverSocketId = getReceiverSocketId(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json({
            message: "New message created successfully",
            newMessage
        });

    } catch (error) {
        return res.status(500).json({
            message: `send Message error ${error.message}`
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;

        const conversation = await conversationModel
            .findOne({
                participants: { $all: [sender, receiver] }
            })
            .populate("messages");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        return res.status(200).json({
            message: "Get messages successfully",
            messages: conversation.messages
        });

    } catch (error) {
        return res.status(500).json({
            message: `get Message error ${error.message}`
        });
    }
};