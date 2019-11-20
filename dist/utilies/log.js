"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tracer_1 = __importDefault(require("tracer"));
exports.log = tracer_1.default.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
//# sourceMappingURL=log.js.map