"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Locals {
    static config() {
        const mongoUrl = "mongodb://localhost:27017/soccerfy";
        const secretKey = "%^&^*&-*({SC-554c-234!";
        return {
            mongoUrl,
            secretKey
        };
    }
}
exports.default = Locals;
//# sourceMappingURL=config.js.map