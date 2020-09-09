"use strict";
// import * as dotenv from "dotenv";
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
exports.default = {
    PORT: process.env.PORT || 5000,
    APOLLO: process.env.APOLLO || 4001,
    SECRET_KEY: process.env.SECRET_KEY || "secretTestKey123",
    EXPIRES_IN: process.env.EXPIRES_IN || "2h"
};
