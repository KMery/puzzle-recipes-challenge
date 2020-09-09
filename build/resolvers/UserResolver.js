"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../server/entities/User");
const CreateUserInput_1 = require("../server/inputs/UserInputs/CreateUserInput");
const UpdateUserInput_1 = require("../server/inputs/UserInputs/UpdateUserInput");
const checkJWT_1 = require("../server/middleware/checkJWT");
const LoginUserInput_1 = require("../server/inputs/UserInputs/LoginUserInput");
const config_1 = __importDefault(require("../server/config"));
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let UserResolver = class UserResolver {
    // @Query(() => [User!])
    // async getUsers() {
    //   return User.find()
    // }
    // @Query(() => User)
    // async getUser(@Arg("id") id: string) {
    //   return User.findOne({ where: { id } });
    // }
    getUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findOne({ where: { email: payload === null || payload === void 0 ? void 0 : payload.email } });
        });
    }
    singUp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.hash(input.password, 12);
            if (input.email.length === 0)
                throw new Error("Email can't be empty!");
            // @IsNotEmpty({ message: "email can't be empty" }) input.email
            try {
                let user = yield User_1.User.findOne({ where: { email: input.email } });
                if (user === null || user === void 0 ? void 0 : user.email)
                    throw new Error("Email already in use!");
                yield User_1.User.insert({ name: input.name, email: input.email, password: hashedPassword });
                user = yield User_1.User.findOne({ where: { email: input.email } });
                // await user.save();
                return user;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateUser({ payload }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email: payload === null || payload === void 0 ? void 0 : payload.email } });
            if (!user)
                throw new Error("User not authorized!");
            if (input.email.length === 0)
                throw new Error("Email can't be empty!");
            // console.log(user);
            Object.assign(user, input);
            yield user.save();
            return user;
        });
    }
    deleteUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email: payload === null || payload === void 0 ? void 0 : payload.email } });
            if (!user)
                throw new Error("User not authorized!");
            yield user.remove();
            return true;
        });
    }
    // async updateUser(@Arg("id") id: string, @Arg("input") input: UpdateUserInput) {
    //   const user = await User.findOne({ where: { id } });
    //   if (!user) throw new Error("User not found!");
    //   console.log(user);
    //   Object.assign(user, input);
    //   await user.save();
    //   return user;
    // }
    // @Mutation(() => Boolean)
    // async deleteUser(@Arg("id") id: string) {
    //   const user = await User.findOne({ where: { id } });
    //   if (!user) throw new Error("User not found!");
    //   await user.remove();
    //   return true;
    // }
    // @Query(() => String)
    // @UseMiddleware(checkJWT)
    //   async token(@Ctx() { payload }: MyContext) {
    //     return `Welcome ${payload!.name}`;
    // }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email: input.email } });
            if (!user) {
                throw new Error("Could not find user");
            }
            const verify = yield bcrypt_1.compare(input.password, user.password);
            // console.log(verify);
            if (!verify) {
                throw new Error("Bad password");
            }
            return {
                accessToken: jsonwebtoken_1.sign({ name: user.name, email: user.email }, config_1.default.SECRET_KEY, { expiresIn: config_1.default.EXPIRES_IN })
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserInput_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "singUp", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserInput_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginUserInput_1.LoginUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
