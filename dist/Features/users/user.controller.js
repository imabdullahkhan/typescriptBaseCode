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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const random_number_1 = __importDefault(require("random-number"));
const randomstring_1 = __importDefault(require("randomstring"));
const tracer_1 = __importDefault(require("tracer"));
const email_1 = require("../../email/email");
const Expection = __importStar(require("../../Exception"));
const SuccessResponse_1 = require("../../Exception/SuccessResponse");
const verify_1 = __importDefault(require("../../server/verify"));
const user_message_1 = require("./user.message");
const user_model_1 = __importDefault(require("./user.model"));
const log = tracer_1.default.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
class UserController {
    static verfiyMe(req, res, next) {
        user_model_1.default.findById(req._user._id, { password: 0, verifyPin: 0 }, (err, user) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            if (!user) {
                return next(new Expection.BadRequestException());
            }
            return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SucessfullyUserFound, { user }).json();
        });
    }
    static listAll(req, res, next) {
        user_model_1.default.find({}, { verifyPin: 0, password: 0 }, (err, user) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SucessfullyVerify, { user }).json();
        });
    }
    static verifyPinCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ email: req.query.email }).exec();
                if (!user) {
                    return next(new Expection.NotFoundException(user_message_1.Messages.NotFound));
                }
                if (user.userStatus === "Active" || user.userStatus === "InActive") {
                    log(user.userStatus === "Active", user.userStatus === "InActive", user.userStatus);
                    return next(new Expection.CustomException("User is already Verifyied", 300, Expection.ResponseOrigin.INTERNALSERVER));
                }
                // log(req.query.pin, user.verifyPin);
                if (req.query.pin.toString() === user.verifyPin.toString()) {
                    user.userStatus = "Active";
                    user.verifyPin = undefined;
                    user.save((error, verifyuser) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            return next(new Expection.FatalErrorException());
                        }
                        return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SucessfullyVerify, {}).json();
                    }));
                }
                else {
                    return next(new Expection.CustomException(user_message_1.Messages.PinCodeIsNotValid, 502, Expection.ResponseOrigin.INTERNALSERVER));
                }
            }
            catch (e) {
                log(e);
                return next(new Expection.BadRequestException({ e }));
            }
        });
    }
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gen = {
                    integer: true,
                    max: 9999,
                    min: 1000,
                };
                const pin = random_number_1.default(gen);
                const hash = yield bcrypt_1.default.hash(req.body.password, UserController.saltRound);
                const user = new user_model_1.default({
                    admin: req.body.admin,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: hash,
                    userStatus: "Unverified",
                    verifyPin: pin,
                });
                user.save((err, newUser) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return next(new Expection.CustomException(user_message_1.Messages.ErrorEmailAlreadyExist, Expection.ResponseCode.UNPROCESSABLE, Expection.ResponseOrigin.INTERNALSERVER));
                    }
                    email_1.EmailVerifyShoot(newUser.email, newUser.verifyPin);
                    delete newUser._doc.password;
                    delete newUser._doc.verifyPin;
                    return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SuccessfullyAdminRegister, newUser).json();
                }));
            }
            catch (e) {
                log(e);
                return next(new Expection.CustomException(user_message_1.Messages.ErrorEmailAlreadyExist, Expection.ResponseCode.UNPROCESSABLE, Expection.ResponseOrigin.INTERNALSERVER));
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ email: req.body.email }).exec();
                if (!user) {
                    return next(new Expection.CustomException("Invalid User ID / Password, try again", Expection.ResponseCode.UNAUTHORIZED, Expection.ResponseOrigin.INTERNALSERVER));
                }
                const HashComparision = yield bcrypt_1.default.compare(req.body.password, user.password);
                if (!HashComparision) {
                    return next(new Expection.CustomException("Invalid User ID / Password, try again", Expection.ResponseCode.UNAUTHORIZED, Expection.ResponseOrigin.INTERNALSERVER));
                }
                delete user._doc.password;
                delete user._doc.verifyPin;
                let token;
                if (user.userStatus === "Unverified") {
                    return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.UserIsNotUnVerified, { user, token: null }).json();
                }
                if (user.userStatus === "InActive") {
                    return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.UserIsNotActive, { user, token: null }).json();
                }
                token = verify_1.default.getToken(user._doc);
                return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SuceessfullyLogin, { user, token }).json();
            }
            catch (e) {
                log(e);
                return next(new Expection.BadRequestException({ e }));
            }
        });
    }
    static resendVerifyPinCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const gen = {
                integer: true,
                max: 9999,
                min: 1000,
            };
            const pin = random_number_1.default(gen);
            try {
                const user = yield user_model_1.default.findOne({ email: req.query.email, verifyPin: { $ne: null } }).exec();
                if (!user) {
                    return next(new Expection.NotFoundException("User Not Found"));
                }
                user.verifyPin = pin;
                user.save((err, newUser) => {
                    if (err) {
                        return next(new Expection.FatalErrorException());
                    }
                    email_1.EmailVerifyShoot(newUser.email, newUser.verifyPin);
                    delete newUser._doc.password;
                    delete newUser._doc.verifyPin;
                    return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SuccessfullyResendVerifiedCode, newUser).json();
                });
            }
            catch (e) {
                return next(new Expection.BadRequestException());
            }
        });
    }
    static logout(req, res, next) {
        req.logout();
        return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SuceessfullyLogout, {}).json();
    }
    static userGetById(req, res, next) {
        user_model_1.default.findById(req.params.id, (err, user) => {
            if (err) {
                return next(new Expection.BadRequestException());
            }
            if (!user) {
                return next(new Expection.NotFoundException(user_message_1.Messages.NotFound));
            }
            delete user._doc.password;
            delete user._doc.verifyPin;
            return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.SucessfullyUserFound, { user }).json();
        });
    }
    static forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ email: req.body.email }).exec();
                if (!user) {
                    return next(new Expection.NotFoundException(user_message_1.Messages.NotFound));
                }
                if (user.userStatus === "InActive") {
                    return next(new Expection.CustomException(user_message_1.Messages.UserIsNotActive, 402, Expection.ResponseOrigin.INTERNALSERVER));
                }
                const newPassword = randomstring_1.default.generate(7);
                email_1.EmailForgotShoot(user.firstname, user.email, newPassword);
                try {
                    const hash = yield bcrypt_1.default.hash(newPassword, UserController.saltRound);
                    user.password = hash;
                    yield user.save();
                    return new SuccessResponse_1.SuccessfullResponse(res, user_message_1.Messages.PasswordForgetSucessully, {}).json();
                }
                catch (error) {
                    log(error);
                    return next(new Expection.FatalErrorException());
                }
            }
            catch (e) {
                return next(new Expection.BadRequestException());
            }
        });
    }
}
UserController.saltRound = 10;
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map