import { ObjectId } from 'mongodb';

interface ProfileI{
  username: string;
  role: 'Admin' | 'User';
  password: string;
}
interface UserI {
  _id?: ObjectId;
  name: string;
  email:string;
  profiles:ProfileI[];
  token?: string;
}

export  { UserI , ProfileI };