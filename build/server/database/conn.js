"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConn = void 0;
const typeorm_1 = require("typeorm");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("../../resolvers/UserResolver");
const CategoryResolver_1 = require("../../resolvers/CategoryResolver");
const RecipeResolver_1 = require("../../resolvers/RecipeResolver");
function startConn(port) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield typeorm_1.createConnection().then(connection => {
                console.log('DB is connected!');
            }).catch(error => console.log(error));
            const schema = yield type_graphql_1.buildSchema({
                resolvers: [
                    UserResolver_1.UserResolver,
                    CategoryResolver_1.CategoryResolver,
                    RecipeResolver_1.RecipeResolver
                ],
                validate: false
                // context: ({ req }) => {
                // return {
                //   req: req
                // }
            });
            const server = new apollo_server_1.ApolloServer({
                schema,
                context: ({ req }) => {
                    const context = {
                        req
                    };
                    return context;
                },
            });
            yield server.listen(port);
            console.log(`Server Apollo has started! go to http://localhost:${port}/`);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.startConn = startConn;
