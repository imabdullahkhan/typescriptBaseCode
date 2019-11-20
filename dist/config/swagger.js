"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    apis: ["./dist/Features/users/user.router.js"],
    swaggerDefinition: {
        basepath: "/",
        info: {
            description: "Cruze 4 Cash",
            title: "API OF CRUZE FOR CASH",
            version: "0.0.2",
        },
        schemes: {
            name: "http",
        },
        securityDefinitions: {
            Bearer: {
                description: "For accessing the API a valid JWT token must be passed in all the queries in the Authorization header A valid JWT token is generated by the API and retourned as answer of a call to the route /login giving a valid user & password. The following syntax must be used in the Authorization header : \n Bearer: xxxxxx.yyyyyyy.zzzzzz",
                in: "header",
                name: "authorization",
                type: "apiKey",
            }
        },
    },
};
const spec = swagger_jsdoc_1.default(options);
exports.default = spec;
//# sourceMappingURL=swagger.js.map