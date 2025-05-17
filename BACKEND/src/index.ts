import express,{Request,Response, urlencoded} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({path:"../.env"});

import userRoutes from './Routes/User.routes';
import loanRoutes from './Routes/loanRoutes'

const PORT= process.env.PORT || 9090;

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//route middlewares

app.use('/api/user',userRoutes);
app.use('/api/loan',loanRoutes);

async function startDB(){
    mongoose.connect(`${process.env.MONGO_URL}`).
    then(()=>console.log('Connected to Db')).
    catch((err)=> console.error("MongoDB connection error:", err));
    app.listen(PORT,()=>{
        console.log(`Server Served At PORT ${PORT}`);
    })
}

startDB();
