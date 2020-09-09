"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const config_1 = __importDefault(require("./config"));
const conn_1 = require("./database/conn");
// import { buildSchemaFromTypeDefinitions } from "apollo-server";
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
const port = config_1.default.PORT;
app.listen(port, () => {
    console.log(`Express app listening on port ${port}!`);
});
const apollo = config_1.default.APOLLO;
conn_1.startConn(apollo);
