import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res,next) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error)
  }
};
