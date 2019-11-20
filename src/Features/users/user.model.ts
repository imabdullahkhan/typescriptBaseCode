// var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
import mongoose, { Model } from "mongoose";
import { PassportLocalSchema } from "mongoose";
import passportLocalMongoose = require("passport-local-mongoose");
import { IUser } from "./../../interfaces/models/IUser";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  admin: {
    default: false,
    type: Boolean
  },
  email: { type: String, unique: true },
  firstname: {
    default: "",
    type: String
  },
  lastname: {
    default: "",
    type: String
  },
  password: String,
  userStatus: {
    default:  "Unverified",
    enum: ["Active", "InActive", "Unverified"],
    type: String,
  },
  verifyPin : Number
});

const User: Model<IUser> = mongoose.model("User", UserSchema);

export default User;
// export default mongoose.model("User", User);
