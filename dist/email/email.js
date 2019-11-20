"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("../config/email");
exports.EmailVerifyShoot = (emailTo, pin) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Hello Dear,
    your registration pincode is ${pin}`;
    email_1.sendMail(emailTo, "Your Verification Code ", message);
});
exports.EmailForgotShoot = (userName, emailTo, password) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Hello ${userName},
your new  Forgot Password  is ${password}`;
    email_1.sendMail(emailTo, "Your Verification Code for cruze4cash", message);
});
//# sourceMappingURL=email.js.map