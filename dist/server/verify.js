"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tracer_1 = __importDefault(require("tracer"));
const config_1 = __importDefault(require("../config/config"));
const log = tracer_1.default.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
const verify_messages_1 = require("./verify.messages");
class Verify {
    static getToken(user) {
        return jsonwebtoken_1.default.sign(user, config_1.default.config().secretKey);
    }
    static user(req, res, next) {
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers.authorization;
        // log(req.headers.authorization.split(" ")[0], "BEAR");
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            token = req.headers.authorization.split(" ")[1];
        }
        // decode token
        if (token) {
            // verifies secret and checks exp
            jsonwebtoken_1.default.verify(token, config_1.default.config().secretKey, (err, decoded) => {
                if (err) {
                    const error = new Error(verify_messages_1.Messages.NotAuthenticated);
                    error.status = 401;
                    return next(error);
                }
                else {
                    // if everything is good, save to request for use in other routes
                    req._user = decoded;
                    next();
                }
            });
        }
        else {
            // if there is no token
            // return an error
            const error = new Error(verify_messages_1.Messages.NoTokenProvided);
            error.status = 403;
            return next(error);
        }
    }
    static admin(req, res, next) {
        // check header or url parameters or post parameters for token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jsonwebtoken_1.default.verify(token, config_1.default.config().secretKey, (err, decoded) => {
                if (err) {
                    const error = new Error(verify_messages_1.Messages.NotAuthenticated);
                    error.status = 401;
                    return next(error);
                }
                else {
                    // if everything is good, save to request for use in other routes
                    req._user = decoded;
                    // check if the user has admin flag true
                    if (req._user.admin) {
                        next();
                    }
                    else {
                        res.status(403).json({
                            message: verify_messages_1.Messages.NotAuthenticated
                        });
                    }
                }
            });
        }
        else {
            // if there is no token
            // return an error
            const error = new Error(verify_messages_1.Messages.NoTokenProvided);
            error.status = 403;
            return next(error);
        }
    }
}
exports.default = Verify;
//# sourceMappingURL=verify.js.map