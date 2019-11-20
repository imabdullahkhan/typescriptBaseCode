#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const ascii_art_1 = __importDefault(require("ascii-art"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
// import debug from
// import debug = require("debug")("api:server");
// let http = require('http');
// let log = require('tracer').console({format : "{{message}}  - {{file}}:{{line}}"}).log;
// let art = require('ascii-art');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "3000");
app_1.default.set("port", port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const portNumber = parseInt(val, 10);
    if (isNaN(portNumber)) {
        // named pipe
        return val;
    }
    if (portNumber >= 0) {
        // port number
        return portNumber;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            // tslint:disable-next-line:no-console
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            // tslint:disable-next-line:no-console
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    //   debug('Listening on ' + bind);
    ascii_art_1.default.font("SOCCERFY BACKEND ", "Doom", (rendered) => {
        // tslint:disable-next-line:no-console
        console.log(rendered);
    });
    // tslint:disable-next-line:no-console
    console.log("Server Running on port " + app_1.default.get("port"));
    // tslint:disable-next-line:no-console
    console.log("###########################################################################");
}
//# sourceMappingURL=www.js.map