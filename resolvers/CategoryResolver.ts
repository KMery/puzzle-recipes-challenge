import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";

import { Category } from '../server/entities/Category';
import { CreateCategoryInput } from "../server/inputs/CategoryInputs/CreateCategoryInput";
import { UpdateCategoryInput } from "../server/inputs/CategoryInputs/UpdateCategoryInput";
import { checkJWT } from "../server/middleware/checkJWT";
import { MyContext } from "../server/middleware/myContext";

@Resolver(of => Category)
export class CategoryResolver {
  @Query(returns => [Category!])
  @UseMiddleware(checkJWT)
  async getCategories(@Ctx() { payload }: MyContext) {  
    return await Category.find();
  }

  @Query(() => Category!)
  @UseMiddleware(checkJWT)
  async getOneCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string) {  
    return await Category.findOne({ where: { id } });
  }

  @Mutation(() => Category!)
  @UseMiddleware(checkJWT)
  async createCategory(@Ctx() { payload }: MyContext, @Arg("input") input: CreateCategoryInput) {
    let category = await Category.findOne({where: {name: input.name}});
    if (category) throw new Error("Category already exists!");
    category = await Category.create(input);
    await category.save();
    return category;
  }

  @Mutation(() => Category)
  @UseMiddleware(checkJWT)
  async updateCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string, @Arg("input") input: UpdateCategoryInput) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    Object.assign(category, input);
    await category.save();
    return category;
   }

  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    await category.remove();
    return true;
  }
}


