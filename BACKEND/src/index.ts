import express,{Request,Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app=express();

const PORT= process.env.PORT || 9090;

app.get('/',(req,res)=>{
    res.send('SERVER IS RUNNING');
})

app.listen(PORT,()=>{
    console.log(`Server Served At Port ${PORT}`);
})
app.use(express.json());
