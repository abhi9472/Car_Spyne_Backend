import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Products } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApeError.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage(); // Using memory storage to directly pass file buffer
const upload = multer({ storage });

const updateprice = asyncHandler(async (req, res) => {
  const homeid = req.query.id;
  const { newPrice } = req.body;

  try {
    // const home=Products.findById(homeid);
    const home = await Products.findByIdAndUpdate(
      homeid,
      { price: newPrice },
      { new: true }, // This option returns the updated document
    );

    if (!home) {
      throw new ApiError(401, "Home not exist");
    }

    //    home.price=newPrice;
    //    await home.save

    return res.status(200).json(new ApiResponse(200, "price updated"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
const updatetitle = asyncHandler(async (req, res) => {
  const homeid = req.query.id;
  const { newTitle } = req.body;

  try {
    // const home=Products.findById(homeid);
    const home = await Products.findByIdAndUpdate(
      homeid,
      { title: newTitle },
      { new: true }, // This option returns the updated document
    );

    if (!home) {
      throw new ApiError(401, "Car not exist");
    }

    //    home.price=newPrice;
    //    await home.save

    return res.status(200).json(new ApiResponse(200, "title updated"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
const updatedescription = asyncHandler(async (req, res) => {
  const homeid = req.query.id;
  const { newDescription } = req.body;

  try {
    // const home=Products.findById(homeid);
    const home = await Products.findByIdAndUpdate(
      homeid,
      { description: newDescription },
      { new: true }, // This option returns the updated document
    );

    if (!home) {
      throw new ApiError(401, "Car not exist");
    }

    //    home.price=newPrice;
    //    await home.save

    return res.status(200).json(new ApiResponse(200, "Description updated"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
const updatetags = asyncHandler(async (req, res) => {
  const homeid = req.query.id;
  const { newTags } = req.body;

  try {
    // const home=Products.findById(homeid);
    const home = await Products.findByIdAndUpdate(
      homeid,
      { tags: newTags },
      { new: true }, // This option returns the updated document
    );

    if (!home) {
      throw new ApiError(401, "Car not exist");
    }

    //    home.price=newPrice;
    //    await home.save

    return res.status(200).json(new ApiResponse(200, "Tags updated"));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updatelocation = asyncHandler(async (req, res) => {
  const locationid = req.query.id;
  const { newlocation } = req.body;

  // const user=req.user._id;
  try {
    const homes = await Products.findByIdAndUpdate(
      locationid,
      { location: newlocation },
      { new: true },
    );

    if (!homes) {
      return new ApiResponse(401, "No Homes available to update location");
    }

    return res.status(200).json(200, {}, "new location updated");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
const deleteHome = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const userid = req.user._id;
  try {
    console.log(req.query.id);

    if (!id) throw new ApiError(400, "Homes not Avaialable");
    const home = await Products.findById(id);

    // const arr=Products.

    //    console.log(home);
    //    console.log(home.image);
    const img = home.image;
    await Promise.all(
      img.map(async (temp) => {
        await deleteCloudinaryResource(temp);
      }),
    );
    await Products.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted"));
  } catch (error) {
    throw res.status(500).json({ message: error.message });
  }
});

const deleteCloudinaryResource = async (cloudPath) => {
  try {
    if (!cloudPath) return null;
    const public_id = extractPublicId(
      cloudPath,
      process.env.CLOUDINARY_CLOUD_NAME,
    ).split("/");
    const path = public_id[public_id.length - 1];
    const response = await cloudinary.uploader.destroy(path, {
      resource_type: "image",
      invalidate: true,
    });

    return response;
  } catch (error) {
    return error;
  }
};

const updatePhoneNum = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { newnumber } = req.body;
  try {
    const home = await User.findByIdAndUpdate(
      id,
      { phoneNum: newnumber },
      {
        new: true,
      },
    );

    if (!home) {
      return res.status(401, "No user is available to change number");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Number changed successfully", User));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateavatar = asyncHandler(async (req, res) => {
  // const userId = req.user._id; // Assuming user ID is available via authentication middleware

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log(req.file.path);

  try {
    const id = req.user?._id;
    const user = await User.findById(id).select("-password -refreshToken");

    let localpath;

    if (req.file.path) {
      localpath = req.file.path;
    }
    console.log(localpath);
    const newavatar = await uploadOnCloudinary(localpath);
    console.log(newavatar);

    user.avatar = newavatar?.url;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(
        new ApiResponse(200, "Avatar updated", { "new Url": newavatar?.url }),
      );
    // const updatedUser = await User.findByIdAndUpdate(
    //     userId,
    //     { avatar: newImageUrl },
    //     { new: true }
    // );

    // if (!updatedUser) {
    //     return res.status(404).json(new ApiResponse(404, "User not found"));
    // }

    // return res.status(200).json(new ApiResponse(200, "Profile pic changed", updatedUser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updatepassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.comparePassword(oldpassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newpassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
export {
  updateprice,
  updatelocation,
  updatePhoneNum,
  updateavatar,
  updatepassword,
  deleteHome,
  updatedescription,
  updatetags,
  updatetitle,
};
