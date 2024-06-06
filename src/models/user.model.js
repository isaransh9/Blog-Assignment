import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Schema of users
const userSchema = new Schema(
  {
    fullName: {
      required: [true, "Fullname is required"],
      type: String,
    },
    email: {
      required: [true, "Email is required"],
      type: String,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
      },
    ],
    password: {
      required: [true, "Password is required"],
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// save encrypted password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if it not modified then return
  this.password = await bcrypt.hash(this.password, 10); // 10 rounds of algorithm
  next();
});

// Check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
