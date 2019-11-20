"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseException_1 = require("./ResponseException");
const ResponseException_2 = require("./ResponseException");
class SuccessfullResponse {
    constructor(res, message, data) {
        this.Status = ResponseException_2.ResponseCode.SUCCESS;
        this.Response = res;
        this.Message = message;
        this.ResponseOrigin = ResponseException_1.ResponseOrigin.INTERNALSERVER;
        this.Data = data;
    }
    json() {
        return this.Response.status(200).json({
            data: this.Data,
            message: this.Message,
            status: 200,
            success: true,
        });
    }
}
exports.SuccessfullResponse = SuccessfullResponse;
//# sourceMappingURL=SuccessResponse.js.map