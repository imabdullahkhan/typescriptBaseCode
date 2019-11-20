"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tracer_1 = __importDefault(require("tracer"));
const user_router_1 = __importDefault(require("../Features/users/user.router"));
const log = tracer_1.default.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
const router = express_1.default.Router();
router.use("/users", user_router_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map