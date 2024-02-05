import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {createServer} from 'http'
import connect from './config/db.js'
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
dotenv.config()

const app = express();
app.use(express.json());

app.use(cors());

app.use((req,res,next) => {
    console.log(`//${req.method} ${req.path} `);
    next()
})

await connect(process.env.CONNECTION_STRING)

const httpServer = createServer(app)

httpServer.listen(process.env.PORT,(err) => {
    if(err){
        console.log('Something went wrong',err);
    }
    else{
        console.log(`Server starting on port ${process.env.PORT}`);
    }
});


app.use('/users',userRouter)
app.use('/products',productRouter)