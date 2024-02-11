import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user-model.js";

export const test = (req, res) => {
  res.send("User route");
};  

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

    let updatedFields = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
      updatedFields = { ...updatedFields, password: req.body.password };
    }

    console.log(req.body)
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedFields,
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));

    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token')
      res.status(200).json("User has been deleted...")
    } catch (error) {
      next(error)
    }
}

export const getUserListing = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only see your own listing!"));

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error)
  }
}