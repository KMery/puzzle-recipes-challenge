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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Recipe_1 = require("../server/entities/Recipe");
// import { User } from '../server/entities/User';
const CreateRecipeInput_1 = require("../server/inputs/RecipeInputs/CreateRecipeInput");
const UpdateRecipeInput_1 = require("../server/inputs/RecipeInputs/UpdateRecipeInput");
const checkJWT_1 = require("../server/middleware/checkJWT");
const User_1 = require("../server/entities/User");
const Category_1 = require("../server/entities/Category");
let RecipeResolver = class RecipeResolver {
    getRecipes({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recipe_1.Recipe.find();
        });
    }
    getOneRecipe({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recipe_1.Recipe.findOne({ where: { id } });
        });
    }
    createRecipe({ payload }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            let recipe = yield Recipe_1.Recipe.findOne({ where: { name: input.name } });
            if (recipe)
                throw new Error("Recipe already exists!");
            const user = yield User_1.User.findOne({ where: { email: payload === null || payload === void 0 ? void 0 : payload.email } });
            recipe = Recipe_1.Recipe.create(input);
            // await Recipe.insert({userId: user?.id})
            Object.assign(recipe, { userId: user === null || user === void 0 ? void 0 : user.id });
            if (input.categoryId) {
                const category = yield Category_1.Category.findOne({ where: { id: input.categoryId } });
                Object.assign(recipe, { categoryId: category === null || category === void 0 ? void 0 : category.id });
            }
            else {
                throw new Error("Recipe category doesn't exist!");
            }
            // await User.insert({name: input.name, email: input.email, password: hashedPassword});
            // console.log(recipe);
            yield recipe.save();
            return recipe;
        });
    }
    updateRecipe({ payload }, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield Recipe_1.Recipe.findOne({ where: { id } });
            if (!recipe)
                throw new Error("Recipe not found!");
            Object.assign(recipe, input);
            yield recipe.save();
            return recipe;
        });
    }
    deleteRecipe({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipe = yield Recipe_1.Recipe.findOne({ where: { id } });
            if (!recipe)
                throw new Error("Recipe not found!");
            yield recipe.remove();
            return true;
        });
    }
    getMyRecipes({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { email: payload === null || payload === void 0 ? void 0 : payload.email } });
            return yield Recipe_1.Recipe.find({ where: { userId: user === null || user === void 0 ? void 0 : user.id } });
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Recipe_1.Recipe]),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getRecipes", null);
__decorate([
    type_graphql_1.Query(() => Recipe_1.Recipe),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getOneRecipe", null);
__decorate([
    type_graphql_1.Mutation(() => Recipe_1.Recipe),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateRecipeInput_1.CreateRecipeInput]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "createRecipe", null);
__decorate([
    type_graphql_1.Mutation(() => Recipe_1.Recipe),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")), __param(2, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateRecipeInput_1.UpdateRecipeInput]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "updateRecipe", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "deleteRecipe", null);
__decorate([
    type_graphql_1.Query(() => [Recipe_1.Recipe]),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getMyRecipes", null);
RecipeResolver = __decorate([
    type_graphql_1.Resolver()
], RecipeResolver);
exports.RecipeResolver = RecipeResolver;
