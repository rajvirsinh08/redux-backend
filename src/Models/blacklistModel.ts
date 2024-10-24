import mongoose ,{Document,Schema} from "mongoose";

export interface IBlacklist extends Document{
token:string;

}
const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" },
});

export const Blacklist = mongoose.model<IBlacklist>("Blacklist", blacklistSchema);
// module.exports = Blacklist;
