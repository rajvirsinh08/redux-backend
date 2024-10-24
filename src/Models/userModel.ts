import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  contact: string;
  dob: string;
  city: string;
  password: string;
}
//create schema
const userSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    dob: {
      type: String,
    },
    city: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

//create model

export const User = mongoose.model<IUser>("User", userSchema);

// module.exports = User;
