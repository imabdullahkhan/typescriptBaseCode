"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tracer_1 = __importDefault(require("tracer"));
const config_1 = __importDefault(require("../config/config"));
const log = tracer_1.default.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
const connect = () => {
    mongoose_1.default.connect(config_1.default.config().mongoUrl);
    const db = mongoose_1.default.connection;
    db.on("error", () => log("connection error:"));
    db.once("open", () => {
        // we're connected!
        log(`MongoDB connected on  ${config_1.default.config().mongoUrl}`);
        log(`###########################################################################`);
    });
};
exports.default = connect;
//# sourceMappingURL=database.js.map