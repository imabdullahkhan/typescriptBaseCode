"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomException {
    constructor(message, status, Origin) {
        this.Message = message;
        this.Status = status;
        this.Origin = Origin;
    }
    GetMessage() {
        return this.Message;
    }
    GetStatus() {
        return this.Status;
    }
}
exports.CustomException = CustomException;
//# sourceMappingURL=CustomException.js.map