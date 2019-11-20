import bcrypt from "bcrypt";
import random from "random-number";
import randomstring from "randomstring";
import tracer from "tracer";
import { EmailForgotShoot, EmailVerifyShoot } from "../../email/email";
import * as Expection from "../../Exception";
import { SuccessfullResponse } from "../../Exception/SuccessResponse";
import { INext, IRequest, IResponse } from "../../interfaces/vendors";
import Verify from "../../server/verify";
import { IUser } from "./../../interfaces/models/IUser";
import { Messages } from "./user.message";
import User from "./user.model";
const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;

class UserController {
    public static saltRound = 10;
    public static verfiyMe(req: IRequest, res: IResponse, next: INext) {
        User.findById(req._user._id, { password: 0, verifyPin: 0 }, (err, user) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            if (!user) {
                return next(new Expection.BadRequestException());
            }
            return new SuccessfullResponse(res, Messages.SucessfullyUserFound, { user }).json();
        });
    }
    public static listAll(req: IRequest, res: IResponse, next: INext) {
        User.find({}, { verifyPin: 0, password: 0 }, (err, user: any) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            return new SuccessfullResponse(res, Messages.SucessfullyVerify, { user }).json();
        });
    }
    public static async verifyPinCode(req: IRequest, res: IResponse, next: INext) {
        try {
            const user = await User.findOne({ email: req.query.email }).exec();
            if (!user) {
                return next(new Expection.NotFoundException(Messages.NotFound));
            }
            if (user.userStatus === "Active" || user.userStatus === "InActive") {
                log(user.userStatus === "Active", user.userStatus === "InActive", user.userStatus);
                return next(new Expection.CustomException("User is already Verifyied", 300, Expection.ResponseOrigin.INTERNALSERVER));
            }
            // log(req.query.pin, user.verifyPin);
            if (req.query.pin.toString() === user.verifyPin.toString()) {
                user.userStatus = "Active";
                user.verifyPin = undefined;
                user.save(async (error: any, verifyuser: any) => {
                    if (error) {
                        return next(new Expection.FatalErrorException());
                    }
                    return new SuccessfullResponse(res, Messages.SucessfullyVerify, {}).json();
                });
            } else {
                return next(new Expection.CustomException(Messages.PinCodeIsNotValid, 502, Expection.ResponseOrigin.INTERNALSERVER));
            }
        } catch (e) {
            log(e);
            return next(new Expection.BadRequestException({ e }));
        }

    }
    public static async register(req: IRequest, res: IResponse, next: INext) {
        try {
            const gen = {
                integer: true,
                max: 9999,
                min: 1000,
            };
            const pin: number = random(gen);
            const hash: string = await bcrypt.hash(req.body.password, UserController.saltRound);
            const user: IUser = new User({
                admin: req.body.admin,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash,
                userStatus: "Unverified",
                verifyPin: pin,
            });
            user.save(async (err, newUser: any) => {
                if (err) {
                    return next(new Expection.CustomException(Messages.ErrorEmailAlreadyExist, Expection.ResponseCode.UNPROCESSABLE, Expection.ResponseOrigin.INTERNALSERVER));
                }
                EmailVerifyShoot(newUser.email, newUser.verifyPin);
                delete newUser._doc.password;
                delete newUser._doc.verifyPin;
                return new SuccessfullResponse(res, Messages.SuccessfullyAdminRegister, newUser).json();
            });

        } catch (e) {
            log(e);
            return next(new Expection.CustomException(Messages.ErrorEmailAlreadyExist, Expection.ResponseCode.UNPROCESSABLE, Expection.ResponseOrigin.INTERNALSERVER));
        }
    }

    public static async login(req: IRequest, res: IResponse, next: INext) {
        try {
            const user: any = await User.findOne({ email: req.body.email }).exec();
            if (!user) {
                return next(new Expection.CustomException("Invalid User ID / Password, try again", Expection.ResponseCode.UNAUTHORIZED, Expection.ResponseOrigin.INTERNALSERVER));
            }
            const HashComparision: boolean = await bcrypt.compare(req.body.password, user.password);
            if (!HashComparision) {
                return next(new Expection.CustomException("Invalid User ID / Password, try again", Expection.ResponseCode.UNAUTHORIZED, Expection.ResponseOrigin.INTERNALSERVER));
            }
            delete user._doc.password;
            delete user._doc.verifyPin;
            let token: string;
            if (user.userStatus === "Unverified") {
                return new SuccessfullResponse(res, Messages.UserIsNotUnVerified, { user, token: null }).json();
            }
            if (user.userStatus === "InActive") {
                return new SuccessfullResponse(res, Messages.UserIsNotActive, { user, token: null }).json();
            }
            token = Verify.getToken(user._doc);
            return new SuccessfullResponse(res, Messages.SuceessfullyLogin, { user, token }).json();
        } catch (e) {
            log(e);
            return next(new Expection.BadRequestException({ e }));
        }
    }
    public static async resendVerifyPinCode(req: IRequest, res: IResponse, next: INext) {
        const gen = {
            integer: true,
            max: 9999,
            min: 1000,
        };
        const pin = random(gen);
        try {
            const user: IUser = await User.findOne({ email: req.query.email, verifyPin: { $ne: null } }).exec();
            if (!user) {
                return next(new Expection.NotFoundException("User Not Found"));
            }
            user.verifyPin = pin;
            user.save((err, newUser: any) => {
                if (err) {
                    return next(new Expection.FatalErrorException());
                }
                EmailVerifyShoot(newUser.email, newUser.verifyPin);
                delete newUser._doc.password;
                delete newUser._doc.verifyPin;
                return new SuccessfullResponse(res, Messages.SuccessfullyResendVerifiedCode, newUser).json();
            });
        } catch (e) {
            return next(new Expection.BadRequestException());
        }
    }
    public static logout(req: IRequest, res: IResponse, next: INext) {
        req.logout();
        return new SuccessfullResponse(res, Messages.SuceessfullyLogout, {}).json();
    }
    public static userGetById(req: IRequest, res: IResponse, next: INext) {
        User.findById(req.params.id, (err: Error, user: any) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            if (!user) {
                return next(new Expection.NotFoundException(Messages.NotFound));
            }
            delete user._doc.password;
            delete user._doc.verifyPin;
            return new SuccessfullResponse(res, Messages.SucessfullyUserFound, { user }).json();
        });
    }
    public static async forgetPassword(req: IRequest, res: IResponse, next: INext) {
        try {
            const user: IUser = await User.findOne({ email: req.body.email }).exec();
            if (!user) {
                return next(new Expection.NotFoundException(Messages.NotFound));
            }
            if (user.userStatus === "InActive") {
                return next(new Expection.CustomException(Messages.UserIsNotActive, 402, Expection.ResponseOrigin.INTERNALSERVER));
            }
            const newPassword = randomstring.generate(7);
            EmailForgotShoot(user.firstname, user.email, newPassword);
            try {
                const hash = await bcrypt.hash(newPassword, UserController.saltRound);
                user.password = hash;
                await user.save();
                return new SuccessfullResponse(res, Messages.PasswordForgetSucessully, {}).json();
            } catch (error) {
                log(error);
                return next(new Expection.FatalErrorException());
            }
        } catch (e) {
            return next(new Expection.BadRequestException());
        }
    }
}

export default UserController;
