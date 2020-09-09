import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "reflect-metadata"

import SERVER_PORT from './config';
import { startConn } from './database/conn';
// import { buildSchemaFromTypeDefinitions } from "apollo-server";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const port = SERVER_PORT.PORT; 
app.listen(port, () => {
    console.log(`Express app listening on port ${port}!`);
});

const apollo = SERVER_PORT.APOLLO
startConn(apollo);
