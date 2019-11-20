import { sendMail } from "../config/email";

export const EmailVerifyShoot = async (emailTo: string, pin: number) => {
    const message = `Hello Dear,
    your registration pincode is ${pin}`;
    sendMail(emailTo, "Your Verification Code ", message);
};

export const EmailForgotShoot = async (userName: string, emailTo: string, password: string) => {
    const message = `Hello ${userName},
your new  Forgot Password  is ${password}`;
    sendMail(emailTo, "Your Verification Code for cruze4cash", message);
};
