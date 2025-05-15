import { Request, RequestHandler, Response } from "express";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from "../Models/User.Model";
import { profile } from "console";

export  const checkStatusRoute:RequestHandler=(req,res)=>{
    res.status(200).json({message:'server Running'});
}

export const registerUser:RequestHandler=async (req,res):Promise<void> =>{
    try{
        const {name,username,email,role,password} = req.body as {
            name:string,
            username:string,
            email:string,
            role:'Admin' | 'User',
            password:string
        };
        if(!name || !username || !email || !password || !role){
            res.status(409).json({message:"All Fields Are Required"});
            return;
        }
        const isExistingUser=await User.findOne({email});
        const hashedPassword=await bcrypt.hash(password,10);
        if(isExistingUser){
            const roleExist=isExistingUser.profiles.some((profile)=> profile.role===role);
            if(roleExist){
                res.status(409).json({message:'User Already Registered'});
                return;
            }
            isExistingUser.profiles.push({
                username,
                role,
                password: hashedPassword,
            })
            await isExistingUser.save();
            res.status(201).json({message: `Added ${role} profile to existing user` });
            return;
        }
        const newUser=new User({
            name,
            email,
            profiles:[
                {
                    username,
                    role,
                    password: hashedPassword,
                }
            ]
        });
        await newUser.save();
        res.status(201).json({message:"Registered User Successfully"});
    }catch(err:unknown){
        if(err instanceof Error){
            res.status(500).json({message:err.message});
        }else{
            res.status(500).json({message:"Unknown Error"});
        }
    }
}

export const login:RequestHandler=async (req,res):Promise<void> =>{
    try{
        const {username,email,password,role}=req.body as {
            username:string,
            email:string,
            password:string,
            role:'Admin' | 'User'
        };
        if(!username || !email || !password || !role ){
            res.status(409).json({message:"All Fields Are Required"});
            return;
        }
        const isExistingUser=await User.findOne({email});
        if(!isExistingUser){
            res.status(404).json({message:"User Not Found"});
            return;
        }
        const currProfile=isExistingUser.profiles.find(
            (profile)=>
            profile.username===username 
            &&
            profile.role===role
            );
        if(!currProfile){
            res.status(404).json({message:"Profile With The Given Role Not Found"});
            return;
        }
        const isPasswordRight=await bcrypt.compare(password,currProfile.password);
        if(!isPasswordRight){
            res.status(400).json("Invalid Credentials");
            return;
        }
        const token=crypto.randomBytes(32).toString("hex");
        isExistingUser.token=token;
        await isExistingUser.save();
        res.status(200).json({
            message:"Login Successful",
            token,
            role:currProfile.role,
            username:currProfile.username
        });
    }catch(err:unknown){
        if(err instanceof Error){
            res.status(500).json({message:err.message});
        }else{
            res.status(500).json({message:"Unknown Error"});
        }
    }
}