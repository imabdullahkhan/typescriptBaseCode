import jwt from "jsonwebtoken";
import tracer from "tracer";
import locals from "../config/config";
import User from "../Features/users/user.model";
import { INext, IRequest, IResponse } from "../interfaces/vendors";
const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
import { Messages } from "./verify.messages";

class Verify {
  public static getToken(user: any) {

    return jwt.sign(user, locals.config().secretKey);
  }

  public static user(req: IRequest, res: IResponse, next: INext) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers.authorization;
    // log(req.headers.authorization.split(" ")[0], "BEAR");
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      token = req.headers.authorization.split(" ")[1];
    }
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, locals.config().secretKey, (err: any, decoded: any) => {
        if (err) {
          const error: any = new Error(Messages.NotAuthenticated);
          error.status = 401;
          return next(error);
        } else {
          // if everything is good, save to request for use in other routes
          req._user = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      const error: any = new Error(Messages.NoTokenProvided);
      error.status = 403;
      return next(error);
    }
  }

  public static admin(req: IRequest, res: IResponse, next: INext) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, locals.config().secretKey, (err: any, decoded: any) => {
        if (err) {
          const error: any = new Error(Messages.NotAuthenticated);
          error.status = 401;
          return next(error);
        } else {
          // if everything is good, save to request for use in other routes
          req._user = decoded;

          // check if the user has admin flag true
          if (req._user.admin) {
            next();
          } else {
            res.status(403).json({
              message: Messages.NotAuthenticated
            });
          }
        }
      });
    } else {
      // if there is no token
      // return an error
      const error: any = new Error(Messages.NoTokenProvided);
      error.status = 403;
      return next(error);
    }
  }
}
export default Verify;
