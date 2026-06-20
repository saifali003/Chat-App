import uploadOnCloudinary from "../config/cloudinary.js";
import userModel from "../models/user.model.js"

export const getCurrentUser = async(req,res)=>{
    try {
        let userId = req.userId
        let user = await userModel.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({
                messsage : "User not found"
            })
        }
        return res.status(200).json({
            messsage : "Get user successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            messsage : `current user error ${error}`
        })
    }
}

export const editProfile = async (req, res) => {
    try {
        const { name } = req.body;

        let updateData = {
            name
        };

        if (req.file) {
            const image = await uploadOnCloudinary(req.file.path);
            updateData.image = image;
        }

        const user = await userModel.findByIdAndUpdate(
            req.userId,
            updateData,
            {
                new: true
            }
        ).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: `Profile error ${error.message}`
        });
    }
};


export const getOtherUsers = async(req,res)=>{
    try {
        const users = await userModel.find({
            _id : {$ne:req.userId}
        }).select("-password");
        return res.status(200).json({
            message : "Users fetched successfully",
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: `get other users error ${error.message}`
        });
    }
}

export const search = async(req,res)=>{
    try {
        let {query} = req.query
        if(!query){
            return res.status(400).json({
                message : "query is required"
            })
        }
        let users = await userModel.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {userName:{$regex:query,$options:"i"}}
            ]
        })
        return res.status(200).json({
            messsage : "users search sucessfully",
            users
        })
    } catch (error) {
         return res.status(500).json({
            message: `search users error ${error.message}`
        });
    }
}