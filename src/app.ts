import * as bodyParser from "body-Parser";
import cookieParser from "cookie-parser";
import cors = require("cors");
import express from "express";
import logger from "morgan";
import passport from "passport";
import * as path from "path";
import favicon from "serve-favicon";
import swaggerUi from "swagger-ui-express";
import tracer from "tracer";
import swaggerSpec from "./config/swagger";
import * as Exception from "./Exception/index";
import routes from "./router/router";
import "./server/auth";
import databaseConnection from "./server/database";
const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
const app = express();
// connecting Database
databaseConnection();
// Configuration of Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Setup Passport.js for token based user auth
app.use(passport.initialize());

// Requiring routes
app.use("/api", routes);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err: any = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new Exception.NotFoundException("API PATH NOT FOUND"));
});

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((err: any, req: any, res: any, next: any) => {
        if (err instanceof Exception.ResponseException) {
            res.status(200).json({
                data: null,
                message: err.Message,
                status: err.Status,
                success: false
            });
        } else if (err instanceof Exception.CustomException) {
            res.status(200).json({
                data: null,
                message: err.Message,
                status: err.Status,
                success: false
            });
        } else if (err instanceof Exception.NotFoundException) {
            res.status(200).json({
                data: null,
                message: err.Message,
                status: err.Status,
                success: false
            });
        } else if (err instanceof Exception.BadRequestException) {
            res.status(200).json({
                data: null,
                description: err.Description || null,
                message: err.Message,
                status: err.Status,
                success: false
            });
        } else if (!(err instanceof Exception.ResponseException)) {
            log(err);
            err = new Exception.FatalErrorException(Exception.ResponseOrigin.INTERNALSERVER, Exception.ResponseMessage.FATALERROR);
            res.status(200).json({
                data: null,
                message: err.Message,
                status: err.Status,
                success: false
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof Exception.ResponseException) {
        res.status(200).json({
            data: null,
            message: err.Message,
            status: err.Status,
            success: false
        });
    } else if (err instanceof Exception.CustomException) {
        res.status(200).json({
            data: null,
            message: err.Message,
            status: err.Status,
            success: false
        });
    } else if (err instanceof Exception.NotFoundException) {
        res.status(200).json({
            data: null,
            message: err.Message,
            status: err.Status,
            success: false
        });
    } else if (err instanceof Exception.BadRequestException) {
        res.status(200).json({
            data: null,
            description: err.Description || null,
            message: err.Message,
            status: err.Status,
            success: false
        });
    } else if (!(err instanceof Exception.ResponseException)) {
        log(err);
        err = new Exception.FatalErrorException(Exception.ResponseOrigin.INTERNALSERVER, Exception.ResponseMessage.FATALERROR);
        res.status(200).json({
            data: null,
            message: err.Message,
            status: err.Status,
            success: false
        });
    }
});

export default app;
