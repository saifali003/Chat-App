import genToken from "../config/token.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req,res)=>{
    try {
        const {userName ,email,password} = req.body;
        const userNameExist = await userModel.findOne({userName});
        if(userNameExist){
            return res.status(400).json({
                message : "User already exist"
            })
        }
        const emailExist = await userModel.findOne({email});
        if(emailExist){
            return res.status(400).json({
                message : "User email already exist"
            })
        }
        if(password.length<6){
           return res.status(400).json({
                message : "Password must have at least 6 character"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await userModel.create({
            userName,email,password : hashedPassword
        })
        const token = genToken(user._id);
        res.cookie("token",token,{
            httpOnly : true,
            maxAge : 7*24*60*60*1000,
            sameSite : "None",
            secure : true
        })
        return res.status(201).json({
            message : "User signup successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            message : `signup error ${error}`
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        });

        return res.status(200).json({
            message: "User login successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: `login error ${error}`
        });
    }
};

export const logout = async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({
            message : "User logout successfully"
        })
    } catch (error) {
        res.status(500).json({
             message : `logout error ${error}`
        })
    }
}
