const dotenv = require('dotenv'); 
dotenv.config({path:__dirname + '/.env'})    

export default {
    PORT: process.env.PORT || 5000,
    APOLLO: process.env.APOLLO || 4001,
    SECRET_KEY: process.env.SECRET_KEY || "secretTestKey123",
    EXPIRES_IN: process.env.EXPIRES_IN || "2h"
   }