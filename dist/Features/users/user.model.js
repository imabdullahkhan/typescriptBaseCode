"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// var log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        default: "Unverified",
        enum: ["Active", "InActive", "Unverified"],
        type: String,
    },
    verifyPin: Number
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
// export default mongoose.model("User", User);
//# sourceMappingURL=user.model.js.map