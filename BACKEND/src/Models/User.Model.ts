import { Model, Schema, model } from 'mongoose';
import { UserI, ProfileI } from '../types/UserI';

const profileSchema=new Schema<ProfileI>({
    username:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['Admin','User']
    },
    password:{
        type:String,
        required:true
    }
})

const userSchema=new Schema<UserI>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profiles:{
        type:[profileSchema],
        required:true
    },
    token:{
        type:String,
        default:""
    }
});
const User:Model<UserI> = model<UserI>('User',userSchema);
export default User;