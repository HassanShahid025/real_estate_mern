import express from 'express'
import dotenv from "dotenv";
import { connectDB } from './database/connect.js';
dotenv.config();

const app = express()

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
      await connectDB(process.env.CONNECTION_URI);
      app.listen(PORT, console.log(`Server listening at port: ${PORT}`));
    } catch (error) {
      console.log(error);
    }
  };
  start();