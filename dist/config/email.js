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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailKeys_1 = require("../server/emailKeys");
const log_1 = require("../utilies/log");
const emailFrom = "info@cruze4cash.com";
exports.transporter = nodemailer_1.default.createTransport({
    auth: {
        privateKey: emailKeys_1.key.private_key,
        serviceClient: emailKeys_1.key.client_id,
        type: "OAuth2",
        user: emailFrom,
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
});
exports.sendMail = (emailTo, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.transporter.verify();
        yield exports.transporter.sendMail({
            from: emailFrom,
            subject,
            text,
            to: emailTo,
        });
        log_1.log("MAIL SENT ");
    }
    catch (err) {
        log_1.log(err);
    }
});
exports.sendMailWithAttachments = (emailTo, subject, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.transporter.verify();
        yield exports.transporter.sendMail({
            attachments,
            from: emailFrom,
            subject,
            to: emailTo,
        });
        log_1.log("MAIL SENT ");
    }
    catch (err) {
        log_1.log(err);
    }
});
//# sourceMappingURL=email.js.map