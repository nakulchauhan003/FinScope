import express,{Request,Response} from 'express';
import dotenv from 'dotenv';
dotenv.config({path:"../.env"});

const app=express();

const PORT= process.env.PORT || 9090;
app.get('/',(req,res)=>{
    res.json({message:'SERVER IS RUNNING'});
})

app.listen(PORT,()=>{
    console.log(`Server Served At PORT ${PORT}`);
})
app.use(express.json());
