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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Recipe_1 = require("./Recipe");
let Category = class Category extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({
        type: 'varchar',
        nullable: false,
        length: 20
    }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.Column(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.Column(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(type => Recipe_1.Recipe, recipe => recipe.category, { cascade: true }),
    __metadata("design:type", Array)
], Category.prototype, "recipes", void 0);
Category = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType({ description: "The Categories model" })
], Category);
exports.Category = Category;
