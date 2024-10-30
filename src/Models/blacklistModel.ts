import mongoose, { Document, Schema } from "mongoose";

//Interface for the blacklisttoken model
export interface IBlacklist extends Document {
  token: string;
}

//blacklistSchema
const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" },
});

//blacklistSchema model creation
export const Blacklist = mongoose.model<IBlacklist>(
  "Blacklist",
  blacklistSchema
);
// module.exports = Blacklist;
