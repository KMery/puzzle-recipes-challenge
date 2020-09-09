import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";

import { Category } from '../entities/Category';
import { CreateCategoryInput } from "../inputs/CategoryInputs/CreateCategoryInput";
import { UpdateCategoryInput } from "../inputs/CategoryInputs/UpdateCategoryInput";
import { checkJWT } from "../middleware/checkJWT";
import { MyContext } from "../middleware/myContext";

//You need to singUp an user and login to use this resolver, more information in UserResolver
@Resolver(of => Category)
export class CategoryResolver {
  //This Query return all the categories
  @Query(returns => [Category!])
  @UseMiddleware(checkJWT)
  async getCategories(@Ctx() { payload }: MyContext) {  
    return await Category.find();
  }

  //This Query return one category for the given id
  @Query(() => Category!)
  @UseMiddleware(checkJWT)
  async getOneCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string) {  
    return await Category.findOne({ where: { id } });
  }

  //This mutation let you add a new category
  @Mutation(() => Category!)
  @UseMiddleware(checkJWT)
  async createCategory(@Ctx() { payload }: MyContext, @Arg("input") input: CreateCategoryInput) {
    let category = await Category.findOne({where: {name: input.name}});
    if (category) throw new Error("Category already exists!");
    category = await Category.create(input);
    await category.save();
    return category;
  }

  //This mutation let you update an existent category
  @Mutation(() => Category)
  @UseMiddleware(checkJWT)
  async updateCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string, @Arg("input") input: UpdateCategoryInput) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    Object.assign(category, input);
    await category.save();
    return category;
   }

  //You can delete a Category with this mutation, return true if success
  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteCategory(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Category not found!");
    await category.remove();
    return true;
  }
}


