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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../server/entities/Category");
const CreateCategoryInput_1 = require("../server/inputs/CategoryInputs/CreateCategoryInput");
const UpdateCategoryInput_1 = require("../server/inputs/CategoryInputs/UpdateCategoryInput");
const checkJWT_1 = require("../server/middleware/checkJWT");
let CategoryResolver = class CategoryResolver {
    getCategories({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.find();
        });
    }
    getOneCategory({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.findOne({ where: { id } });
        });
    }
    createCategory({ payload }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield Category_1.Category.findOne({ where: { name: input.name } });
            if (category)
                throw new Error("Category already exists!");
            category = yield Category_1.Category.create(input);
            yield category.save();
            return category;
        });
    }
    updateCategory({ payload }, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findOne({ where: { id } });
            if (!category)
                throw new Error("Category not found!");
            Object.assign(category, input);
            yield category.save();
            return category;
        });
    }
    deleteCategory({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findOne({ where: { id } });
            if (!category)
                throw new Error("Category not found!");
            yield category.remove();
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => [Category_1.Category]),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategories", null);
__decorate([
    type_graphql_1.Query(() => Category_1.Category),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getOneCategory", null);
__decorate([
    type_graphql_1.Mutation(() => Category_1.Category),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateCategoryInput_1.CreateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.Mutation(() => Category_1.Category),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")), __param(2, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateCategoryInput_1.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(checkJWT_1.checkJWT),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver(of => Category_1.Category)
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
