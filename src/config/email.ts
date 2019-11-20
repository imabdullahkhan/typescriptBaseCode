import nodemailer from "nodemailer";
import { key } from "../server/emailKeys";
import { log } from "../utilies/log";
const emailFrom = "info@cruze4cash.com";
export const transporter = nodemailer.createTransport({
    auth: {
        privateKey: key.private_key,
        serviceClient: key.client_id,
        type: "OAuth2",
        user: emailFrom,
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
});
export const sendMail = async (emailTo: string, subject: string, text: string) => {
    try {
        await transporter.verify();
        await transporter.sendMail({
            from: emailFrom,
            subject,
            text,
            to: emailTo,
        });
        log("MAIL SENT ");
    } catch (err) {
        log(err);
    }
};
export const sendMailWithAttachments = async (emailTo: string, subject: string, attachments: any) => {
    try {
        await transporter.verify();
        await transporter.sendMail({
            attachments,
            from: emailFrom,
            subject,
            to: emailTo,
        });
        log("MAIL SENT ");
    } catch (err) {
        log(err);
    }
};
