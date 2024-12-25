import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import DbCards from "./dbCards.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;
app.use(cors());
app.use(express.json());

const connectionUrl = `mongodb+srv://admin:E02DgS0j7BKLaxAT@cluster0.lo4ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(connectionUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
app.get("/tinder/cards",async (req,res)=>{
    const findQuery = {};
    const result = await DbCards.find(findQuery);
    res.status(200).json(result);
})

app.post("/tinder/cards",async (req,res)=>{
    const {name,url} = req.body;
    const createQuery = {name,url};
    const user = await DbCards.create(createQuery);
    res.status(201).json(user);

})
app.listen(port,()=>{
    console.log(`server is running in ${port}`);
})