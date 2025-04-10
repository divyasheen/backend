import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRouter from './routes/users.router.js';
import postRoutes from './routes/post.routes.js';


dotenv.config();
const app = express();

// DB connection
try {
  mongoose.connection.on("connected", () =>
    console.log("✅ DB Connection Established.")
  );
  mongoose.connection.on("error", (err) => console.error(err.message));

  const con2DB = await mongoose.connect(process.env.mongoUri);
} catch (error) {
  console.error(error.message);
}

// middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use('/uploads', express.static('uploads'))

app.use('/users', userRouter);
app.use('/posts', postRoutes);


const port = process.env.PORT;
app.listen(port, console.log(`Server is running on: http://localhost:${port}`));