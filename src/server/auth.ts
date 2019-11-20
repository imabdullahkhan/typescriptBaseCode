import passport from "passport";
import passportLocal = require("passport-local");
import "../config/config";
import User from "../Features/users/user.model";
// var User = require('');
const LocalStrategy = passportLocal.Strategy;
// Setup Local Login Strategy
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
